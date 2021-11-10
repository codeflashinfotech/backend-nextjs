import { IsNotEmpty } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from '../../users/dto';
import {
  SignupConfirmErrorEnum,
  SignupConfirmErrorMsgEnum,
} from '../auth.enum';

export class SignupConfirmDto extends PickType(BaseUserDto, [
  'email',
  'zipCode',
] as const) {
  /**
   * Email confirmation code. In dev mode, any number can be passed.
   * @example '1234'
   */
  @IsNotEmpty()
  emailCode: number;

  /**
   * User's family name should goes here.
   * @example 'Alex family'
   */
  @IsNotEmpty()
  familyName?: string;
}

export class SignupConfirmFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: SignupConfirmErrorEnum;

  /**
   * Description for error code.
   */
  message: SignupConfirmErrorMsgEnum;
}

export class SignupConfirmResponseDto {
  /**
   * access_token should be stored in local storage of app.
   * @example 'eyJhbGciO.123'
   */
  access_token: string;
}
