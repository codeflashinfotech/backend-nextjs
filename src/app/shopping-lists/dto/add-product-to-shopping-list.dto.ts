import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { AddProductToShoppingListSuccessEnum } from '../shopping-lists.enum';
import { FileInterface } from '../../../shared/module/upload/upload.interface';
import { VendorsProviderNamesEnum } from '../../products/products.enum';

export class AddProductToShoppingBodyDTO {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  file?: FileInterface;

  @IsOptional()
  Name?: string;

  @IsNotEmpty()
  @Transform((value) => Number.parseFloat(value))
  @IsNumber()
  Price: number;

  @IsOptional()
  Product_Identifier?: string;

  @IsOptional()
  DataSource?: string;

  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsInt()
  Quantity: number;

  /**
   * use this property for static urls (example comes from nutrix or walmart)
   * */
  @IsOptional()
  ImageURL?: string;

  @IsOptional()
  Aisle?: string;

  @IsOptional()
  Store?: string;

  @IsOptional()
  Comments?: string;

  @IsOptional()
  Food?: string;

  /**
   * this property is product id in external apis like kroger. note: if length of this property is lower than 13 character will automatically fill with 0 from start of string
   * @example 0001111041700
   * */
  @IsOptional()
  @IsString()
  @Transform((value) => String(value).padStart(13, '0'))
  VendorProductId?: string;

  /**
   * this property is product vendor provider name
   * @example kroger
   * */
  @IsOptional()
  @IsEnum(VendorsProviderNamesEnum)
  VendorProviderName?: VendorsProviderNamesEnum =
    VendorsProviderNamesEnum.KROGER;
}

export class AddProductToShoppingParamPostDTO {
  @IsNotEmpty()
  listId: number;
}

export class AddProductToShoppingQueryPostDTO {
  @IsNotEmpty()
  familyId: number;
}

export class AddProductToShoppingResponseDto {
  message: AddProductToShoppingListSuccessEnum;
}
