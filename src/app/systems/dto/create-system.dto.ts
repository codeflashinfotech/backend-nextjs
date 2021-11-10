import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { IdDto } from 'src/shared/dto';
import {
  CreateSystemErrorEnum,
  CreateSystemErrorMsgEnum,
} from '../systems.enum';

export class CreateSystemDto {
  /**
   * Name of Hub
   * @example 'My Hub'
   */
  @IsNotEmpty()
  AppHubName: string;

  /**
   * Address Location (empty string)
   * @example ''
   */
  @IsOptional()
  AddressLocation?: string;

  /**
   * Mac Address (empty string)
   * @example ''
   */
  @IsOptional()
  MacAddress?: string;

  /**
   * Random string with constant length
   * @example '7e03238a'
   */
  @IsNotEmpty()
  HubAppId: string;

  /**
   * Name of home wifi
   * @example 'Alex home'
   */
  @IsNotEmpty()
  WifiName: string;

  /**
   * Refresh Rate
   * @example '1 Hour'
   */
  @IsNotEmpty()
  RefreshRate: string;

  /**
   * Time Zone
   * @example 'PRT,Puerto Rico Time,GMT-4:00'
   */
  @IsNotEmpty()
  TimeZone: string;

  /**
   * Hub IP (empty string)
   * @example ''
   */
  @IsOptional()
  HubIP: string;

  /**
   * Password of Wifi
   * @example '12345678'
   */
  @IsNotEmpty()
  WifiPassword: string;

  /**
   * User's one of the family ids (should be admin).
   */
  @ValidateNested()
  @Type(() => IdDto)
  family: IdDto;
}
export class CreateSystemResponseDto {
  hubId: number;
}

export class CreateSystemFailureDto {
  /**
   * A short code for the error that happended.
   */
  errorCode: CreateSystemErrorEnum;

  /**
   * Description for error code.
   */
  message: CreateSystemErrorMsgEnum;
}
