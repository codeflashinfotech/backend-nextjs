import { IsNotEmpty } from 'class-validator';
import { BaseTokenDto } from '.';
import {
  TokenCreateErrorEnum,
  TokenCreateErrorMsgEnum,
  TokenCreateSuccessEnum,
} from '../notifications.enum';

export class CreateTokenDto extends BaseTokenDto {}

export class CreateTokenResponseDto {
  /**
   * Success response.
   */
  message: TokenCreateSuccessEnum;
}

export class CreateTokenFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: TokenCreateErrorEnum;

  /**
   * Description for error code.
   */
  message: TokenCreateErrorMsgEnum;
}
export class SendNotificationDevDto {
  @IsNotEmpty()
  deviceToken: string;
}
