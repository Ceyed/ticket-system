import { Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AppController } from 'common/decorators/app-controller.decorator';
import { RouteTypeEnum } from 'common/enums/route-type.enum';
import { RefreshTokenDto } from '../../common/dtos/refresh-token.dto';
import { AuthenticationService } from './authentication.service';

@AppController('authentication', RouteTypeEnum.User)
export class AuthenticationNormalController {
    constructor(private readonly _authenticationService: AuthenticationService) {}

    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this._authenticationService.refreshTokens(refreshTokenDto);
    }
}
