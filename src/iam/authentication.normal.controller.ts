import { Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AppController } from 'common/decorators/app-controller.decorator';
import { AppModulesEnum } from 'common/enums/app-modules.enum';
import { RouteTypeEnum } from 'common/enums/route-type.enum';
import { RefreshTokenDto } from '../../common/dtos/refresh-token.dto';
import { AuthenticationService } from './authentication.service';

@AppController(AppModulesEnum.AUTH, 'authentication', RouteTypeEnum.NORMAL)
export class AuthenticationNormalController {
    constructor(private readonly _authenticationService: AuthenticationService) {}

    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this._authenticationService.refreshTokens(refreshTokenDto);
    }
}
