import { IsNotEmpty } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from '../../users/dto';
import {
  ForgetpassConfirmErrorEnum,
  ForgetpassConfirmErrorMsgEnum,
  ForgetPassConfirmSuccessEnum,
} from '../auth.enum';

export class ForgetpassConfirmDto extends PickType(BaseUserDto, [
  'email',
] as const) {
  /**
   * Email confirmation code. In dev mode, any number can be passed.
   * @example '1234'
   */
  @IsNotEmpty()
  forgetPassCode: number;

  /**
   * New password.
   * @example '1234567'
   */
  @IsNotEmpty()
  password: string;
}

export class ForgetpassConfirmFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: ForgetpassConfirmErrorEnum;

  /**
   * Description for error code.
   */
  message: ForgetpassConfirmErrorMsgEnum;
}

export class ForgetpassConfirmResponseDto {
  /**
   * Success response.
   */
  message: ForgetPassConfirmSuccessEnum;
}
