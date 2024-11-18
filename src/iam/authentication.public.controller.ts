import { Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AppController } from 'common/decorators/app-controller.decorator';
import { SignInDto } from 'common/dtos/sign-in.dto';
import { SignUpDto } from 'common/dtos/sign-up.dto';
import { RouteTypeEnum } from 'common/enums/route-type.enum';
import { AuthenticationService } from './authentication.service';

@AppController('authentication', RouteTypeEnum.Public)
export class AuthenticationPublicController {
    constructor(private readonly _authenticationService: AuthenticationService) {}

    @Post('sign-up')
    signUp(@Body() signUpDto: SignUpDto) {
        return this._authenticationService.signUp(signUpDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    signIn(@Body() signInDto: SignInDto) {
        return this._authenticationService.signIn(signInDto);
    }
}
