import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IdDto } from 'src/shared/dto';
import {
  CreateFavoriteProductEnum,
  VendorsProviderNamesEnum,
} from '../products.enum';

export class CreateFavoriteProductDto {
  @IsOptional()
  Product_Identifier?: string;

  @IsOptional()
  DataSource?: string;

  @IsOptional()
  Food?: string;

  @IsOptional()
  ImageURL?: string;

  @IsOptional()
  Comments?: string;

  @IsOptional()
  FoodName?: string;

  @IsOptional()
  Quantity?: number;

  @IsOptional()
  Store?: string;

  @IsOptional()
  Aisle?: string;

  @IsOptional()
  Price?: number;

  /**
   * this property is product id in external apis like kroger
   * @example 0001111041700
   * */
  @IsOptional()
  @IsString()
  VendorProductId?: string;

  /**
   * this property is product vendor provider name
   * @example kroger
   * */
  @IsOptional()
  @IsEnum(VendorsProviderNamesEnum)
  VendorProviderName?: VendorsProviderNamesEnum;

  /**
   * User's one of the family ids (should be user).
   */
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  family: IdDto;
}

export class CreateFavoriteProductResponseDto {
  /**
   * Success response.
   */
  message: CreateFavoriteProductEnum;
}
