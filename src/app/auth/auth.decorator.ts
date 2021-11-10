import { applyDecorators, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { BadRequestDto, UnauthorizedDto } from 'src/shared/dto';
import { Public } from 'src/shared/decorator/public-api.decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  ForgetpassConfirmDto,
  ForgetpassConfirmFailureDto,
  ForgetpassConfirmResponseDto,
  ForgetpassDto,
  ForgetpassFailureDto,
  ForgetpassResponseDto,
  LoginDto,
  LoginFailureDto,
  LoginResponseDto,
  OAuthFailureDto,
  OAuthResponseDto,
  SignupConfirmDto,
  SignupConfirmFailureDto,
  SignupConfirmResponseDto,
  SignupDto,
  SignupFailureDto,
  SignupResponseDto,
} from './dto';
import { SocialOAuthNamesEnum } from './auth.enum';

export function LoginDec() {
  return applyDecorators(
    Public(),
    UseGuards(LocalAuthGuard),
    ApiBody({ type: LoginDto }),
    ApiOperation({
      summary: 'Login',
      description: '',
    }),
    ApiUnauthorizedResponse({
      type: UnauthorizedDto,
      description: 'Unauthorized.',
    }),
    ApiCreatedResponse({
      type: LoginResponseDto,
      description: 'Login succeeded.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: LoginFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function SignupDec() {
  return applyDecorators(
    Public(),
    ApiBody({ type: SignupDto }),
    ApiOperation({
      summary: 'Signup',
      description: '',
    }),
    ApiCreatedResponse({
      type: SignupResponseDto,
      description: 'Signup is done. Confirm code is sent.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: SignupFailureDto,
      description:
        'Unprocessable request. EmailSentFail Error is not going to be thrown in dev mode.',
    }),
  );
}

export function SignupConfirmDec() {
  return applyDecorators(
    Public(),
    ApiBody({ type: SignupConfirmDto }),
    ApiOperation({
      summary: 'Confirm Account',
      description:
        'After signup a unique code will be sent to user email use that code to confirming user acccount',
    }),
    ApiCreatedResponse({
      type: SignupConfirmResponseDto,
      description:
        'Signup confirmation is done. Response contains a token. No need for real code in dev mode.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: SignupConfirmFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function ForgetpassDec() {
  return applyDecorators(
    Public(),
    ApiBody({ type: ForgetpassDto }),
    ApiOperation({
      summary: 'Forget password',
      description: '',
    }),
    ApiCreatedResponse({
      type: ForgetpassResponseDto,
      description: 'Forget pass is done. Confirm code is sent.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: ForgetpassFailureDto,
      description:
        'Unprocessable request. EmailSentFail Error is not going to be thrown in dev mode.',
    }),
  );
}

export function ForgetpassConfirmDec() {
  return applyDecorators(
    Public(),
    ApiBody({ type: ForgetpassConfirmDto }),
    ApiOperation({
      summary: 'Forget password confirmation',
      description:
        'After call forget password a unique code will be sent to the user email , use the code and set new password to change the password.',
    }),
    ApiCreatedResponse({
      type: ForgetpassConfirmResponseDto,
      description: 'Password Changed.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: ForgetpassConfirmFailureDto,
      description: 'Unprocessable request.',
    }),
  );
}

export function OAuthDec() {
  return applyDecorators(
    Public(),
    ApiParam({
      name: 'socialAuthName',
      description: 'name of socialAuth',
      enum: SocialOAuthNamesEnum,
    }),
    ApiOperation({
      summary: 'OAuth login',
      description:
        'Login or sign up with google or facebook or apple. (if not signed up before, it will create new user)',
    }),
    ApiCreatedResponse({
      type: OAuthResponseDto,
      description: 'OAuth is done. JWT token is sent in response.',
    }),
    ApiBadRequestResponse({
      type: BadRequestDto,
      description: 'Bad request. Body properties are invalid.',
    }),
    ApiUnprocessableEntityResponse({
      type: OAuthFailureDto,
      description:
        'Unprocessable request.(in apple OAuth if jwt cant be decoded or kid not exist in jwt header)',
    }),
  );
}
