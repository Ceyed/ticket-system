import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'common/database/postgres/entities/user/user.entity';
import { UserRepository } from 'common/database/postgres/entities/user/user.repository';
import { AccessTokenAndRefreshTokenDto } from 'common/dtos/access-token-and-refresh-token';
import { SignInDto } from 'common/dtos/sign-in.dto';
import { SignUpDto } from 'common/dtos/sign-up.dto';
import { uuid } from 'common/types/uuid.constant';
import { randomUUID } from 'crypto';
import { jwtConfig, JwtConfig } from 'src/app/config/jwt.config';
import { RefreshTokenDto } from '../../common/dtos/refresh-token.dto';
import { ActiveUserDataInterface } from '../../common/interface/active-user-data.interface';
import { HashingService } from './hashing/hashing.service';
import { InvalidatedRefreshTokenError } from './refresh-token-ids.storage/invalidated-refresh-token-error.storage';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage/refresh-token-ids.storage';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly _userRepository: UserRepository,
        private readonly _hashingService: HashingService,
        private readonly _jwtService: JwtService,
        @Inject(jwtConfig.KEY) private readonly _jwtConfig: JwtConfig,
        private readonly _refreshTokenIdsStorage: RefreshTokenIdsStorage,
    ) {}

    async signUp(signUpDto: SignUpDto) {
        try {
            const user = new UserEntity();
            user.username = signUpDto.username;
            user.password = await this._hashingService.hash(signUpDto.password);
            if (signUpDto.role) user.role = signUpDto.role;
            return this._userRepository.save(user);
        } catch (err) {
            const pgUniqueViolationErrorCode = '23505';
            if (err.code === pgUniqueViolationErrorCode) {
                throw new ConflictException();
            }
            throw err;
        }
    }

    async signIn(signInDto: SignInDto) {
        const user = await this._userRepository.findOneBy({ username: signInDto.username });
        if (!user) {
            throw new UnauthorizedException('User does not exists');
        }

        const isEqual = await this._hashingService.compare(signInDto.password, user.password);
        if (!isEqual) {
            throw new UnauthorizedException('Password does not match');
        }

        return this.generateTokens(user);
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<AccessTokenAndRefreshTokenDto> {
        try {
            const { sub, refreshTokenId } = await this._jwtService.verifyAsync<
                Pick<ActiveUserDataInterface, 'sub'> & { refreshTokenId: string }
            >(refreshTokenDto.refreshToken, {
                secret: this._jwtConfig.secret,
                audience: this._jwtConfig.audience,
                issuer: this._jwtConfig.issuer,
            });
            const user: UserEntity = await this._userRepository.findOneByOrFail({ id: sub });
            const isValid: boolean = await this._refreshTokenIdsStorage.validate(
                user.id,
                refreshTokenId,
            );
            if (isValid) {
                await this._refreshTokenIdsStorage.invalidate(user.id);
            } else {
                throw new Error('Invalid refresh token');
            }
            return this.generateTokens(user);
        } catch (error) {
            if (error instanceof InvalidatedRefreshTokenError) {
                throw new UnauthorizedException('Access denied (Token compromised?)');
            }
            throw new UnauthorizedException();
        }
    }

    async generateTokens(user: UserEntity) {
        const refreshTokenId = randomUUID();
        const [accessToken, refreshToken] = await Promise.all([
            this._signToken<Partial<ActiveUserDataInterface>>(
                user.id,
                this._jwtConfig.accessTokenTtl,
                {
                    username: user.username,
                    role: user.role,
                },
            ),
            this._signToken(user.id, this._jwtConfig.refreshTokenTtl, {
                refreshTokenId,
            }),
        ]);

        await this._refreshTokenIdsStorage.insert(user.id, refreshTokenId);
        return { accessToken, refreshToken };
    }

    verifyToken(token: string) {
        try {
            return this._jwtService.verify(token);
        } catch {
            throw new Error('Invalid token');
        }
    }

    private async _signToken<T>(userId: uuid, expiresIn: number, payload?: T) {
        return await this._jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            },
            {
                audience: this._jwtConfig.audience,
                issuer: this._jwtConfig.issuer,
                secret: this._jwtConfig.secret,
                expiresIn,
            },
        );
    }
}
