import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OAuthErrorEnum, OAuthErrorMsgEnum } from '../auth.enum';

export class OAuthDto {
  /**
   * idToken
   * @example 'id123...'
   */
  @IsNotEmpty()
  idToken: string;

  /**
   * if choose apple, this parameter is required
   * @example 'sam balbau'
   */
  @IsOptional()
  @IsString()
  fullName?: string;
}

export class OAuthFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: OAuthErrorEnum;

  /**
   * Description for error code.
   */
  message: OAuthErrorMsgEnum;
}

export class OAuthResponseDto {
  /**
   * access_token should be stored in local storage of app.
   * @example 'eyJhbGciO.123'
   */
  access_token: string;
}
