import {
  ForgetPassErrorEnum,
  ForgetPassErrorMsgEnum,
  ForgetPassSuccessEnum,
} from '../auth.enum';
import { PickType } from '@nestjs/swagger';
import { BaseUserDto } from '../../users/dto';

export class ForgetpassDto extends PickType(BaseUserDto, ['email'] as const) {}

export class ForgetpassFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: ForgetPassErrorEnum;

  /**
   * Description for error code.
   * @example "The email is not exist or confirmed."
   */
  message: ForgetPassErrorMsgEnum;
}

export class ForgetpassResponseDto {
  /**
   * @example 'Forget pass done. Confirmation code sent to the email.'
   */
  message: ForgetPassSuccessEnum;
}
