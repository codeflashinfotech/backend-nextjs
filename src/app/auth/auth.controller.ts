import { Body, Controller, Param, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ForgetpassConfirmDto,
  ForgetpassConfirmResponseDto,
  ForgetpassDto,
  ForgetpassResponseDto,
  LoginDto,
  LoginResponseDto,
  OAuthDto,
  OAuthResponseDto,
  SignupConfirmDto,
  SignupConfirmResponseDto,
  SignupDto,
  SignupResponseDto,
} from './dto';
import {
  ForgetpassConfirmDec,
  ForgetpassDec,
  LoginDec,
  OAuthDec,
  SignupConfirmDec,
  SignupDec,
} from './auth.decorator';

@ApiTags('auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // body param only for validation purpose, req is handled by guard
  @Post('login')
  @LoginDec()
  async login(
    @Request() req,
    @Body() body: LoginDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }

  @Post('signup')
  @SignupDec()
  async signup(@Body() body: SignupDto): Promise<SignupResponseDto> {
    return this.authService.signup(body);
  }

  @Post('signup/confirm')
  @SignupConfirmDec()
  async signupConfirm(
    @Body() body: SignupConfirmDto,
  ): Promise<SignupConfirmResponseDto> {
    return this.authService.signupConfirm(body);
  }

  @Post('forget-pass')
  @ForgetpassDec()
  async forgetPass(
    @Body() body: ForgetpassDto,
  ): Promise<ForgetpassResponseDto> {
    return this.authService.forgetPass(body);
  }

  @Post('forget-pass/confirm')
  @ForgetpassConfirmDec()
  async forgetPassConfirm(
    @Body() body: ForgetpassConfirmDto,
  ): Promise<ForgetpassConfirmResponseDto> {
    return this.authService.forgetPassConfirm(body);
  }

  @Post(':socialAuthName')
  @OAuthDec()
  async socialAuth(
    @Param() param,
    @Body() body: OAuthDto,
  ): Promise<OAuthResponseDto> {
    return this.authService.socialAuth(param.socialAuthName, body);
  }
}
