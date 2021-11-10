import { IsNotEmpty, MinLength } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import {
  SignupErrorEnum,
  SignupErrorMsgEnum,
  SignupSuccessEnum,
} from '../auth.enum';
import { BaseUserDto } from '../../users/dto';

export class SignupDto extends PickType(BaseUserDto, [
  'email',
  'username',
] as const) {
  /**
   * User's password should goes here.
   * @example 'pantryon123'
   */
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  /**
   * User's full name should goes here.
   * @example 'Alex Ferri'
   */
  @IsNotEmpty()
  fullName: string;
}

export class SignupFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: SignupErrorEnum;

  /**
   * Description for error code.
   */
  message: SignupErrorMsgEnum;
}

export class SignupResponseDto {
  /**
   * Success response.
   */
  message: SignupSuccessEnum;
}
