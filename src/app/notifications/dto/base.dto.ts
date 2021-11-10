import { IsNotEmpty } from 'class-validator';

export class BaseTokenDto {
  /**
   * User's device token for push notification.
   * @example 'token123'
   */
  @IsNotEmpty()
  token?: string;
}
