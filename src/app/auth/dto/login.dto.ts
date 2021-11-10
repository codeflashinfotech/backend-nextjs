import { IsNotEmpty } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from '../../users/dto';
import { LoginErrorEnum, LoginErrorMsgEnum } from '../auth.enum';

export class LoginDto extends PickType(BaseUserDto, ['email'] as const) {
  /**
   * User's password should goes here.
   * @example 'pantryon123'
   */
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  /**
   * access_token should be stored in local storage of app.
   * @example 'eyJhbGciO.123'
   */
  access_token: string;
}

export class LoginFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: LoginErrorEnum;

  /**
   * Description for error code.
   */
  message: LoginErrorMsgEnum;
}
