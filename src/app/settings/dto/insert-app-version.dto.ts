import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppOS } from '../settings.enum';

export class InsertAppVersionDto {
  /**
   * version of frontend app
   *  @example 'v1.0.0'
   * */
  @IsNotEmpty()
  version: string;
  /**
   * app os like android
   * @example 'android'
   * */
  @IsNotEmpty()
  @IsEnum(AppOS)
  app: AppOS;

  /**
   * secret key
   * @example '123..'
   * */
  @IsNotEmpty()
  secretKey: string;
}

export class InsertAppVersionResponseDto {
  /**
   * version of frontend app
   * @example 'v1.0.0'
   * */
  version: string;

  /**
   * app os like android
   * @example 'android'
   * */
  app: AppOS;
}
