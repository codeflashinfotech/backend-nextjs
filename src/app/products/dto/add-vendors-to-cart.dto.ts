import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import {
  KrogerAddToCartMsgEnum,
  KrogerUnauthorizedEnum,
  KrogerUnauthorizedMsgEnum,
} from 'src/providers/vendors/kroger/kroger.enum';
import { IdDto } from '../../../shared/dto';

export class AddVendorsToCartDto {
  /**
   * product id
   * @example 0001111041700
   */
  @IsString()
  @IsNotEmpty()
  upc: string;

  /**
   *  number of products for given upc
   * @example 2
   */
  @IsNotEmpty()
  quantity: number;
}

export class AddVendorsToCartParamDto {
  @IsNotEmpty()
  @IsString()
  vendorProvider: string;
}

export class AddVendorsToCartBodyDto {
  /**
   * list of vendors for adding to cart
   */
  @IsNotEmpty()
  vendors: AddVendorsToCartDto[];
  /**
   * User's one of the family ids (should be admin).
   */
  @ValidateNested()
  @Type(() => IdDto)
  family: IdDto;
}

export class AddVendorsToCartFailureDto {
  /**
   * A short code for the error that happened.
   */
  errorCode: KrogerUnauthorizedEnum;

  /**
   * Description for error code.
   */
  message: KrogerUnauthorizedMsgEnum;
}

export class AddVendorsToCartResponseDto {
  message: KrogerAddToCartMsgEnum;
}
