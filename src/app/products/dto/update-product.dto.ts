import {
  UpdateProductErrorMsgEnum,
  UpdateProductErrorStatusEnum,
  UpdateProductSuccessEnum,
  VendorsProviderNamesEnum,
} from '../products.enum';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileInterface } from '../../../shared/module/upload/upload.interface';

export class UpdateProductParamDto {
  @IsNotEmpty()
  productId: number;
}

export class UpdateProductQueryDto {
  @IsNotEmpty()
  @IsBoolean()
  @Transform((value) => value == 'true')
  isShoppingListItem: boolean;

  @IsNotEmpty()
  familyId: number;

  /**
   * check the updated product isReplaced or Not
   * @example false
   */
  @IsOptional()
  @IsBoolean()
  @Transform((value) => value == 'true')
  isReplaced?: boolean;
}

export class UpdateProductBodyDTO {
  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsNumber()
  hubId: number;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  file?: FileInterface;

  @IsOptional()
  Name?: string;

  @IsNotEmpty()
  @Transform((value) => Number.parseFloat(value))
  @IsNumber()
  Price: number;

  @IsOptional()
  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsNumber()
  WeightDaily?: number;

  @IsNotEmpty()
  Product_Identifier: string;

  @IsOptional()
  DataSource?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsNumber()
  ScaleNumber?: number;

  @IsOptional()
  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsNumber()
  PreviousWeight?: number;

  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsNumber()
  Quantity: number;

  /**
   * use this property for static urls (example comes from nutrix or walmart)
   * */
  @IsOptional()
  ImageURL?: string;

  @IsOptional()
  @Transform((value) => {
    return value === '' ? '0' : value;
  })
  QuantityMeasure?: string;

  /**
   * another use for this property is update weight index
   * */
  @IsOptional()
  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsNumber()
  Weight?: number;

  @IsOptional()
  Food?: string;

  @IsOptional()
  Aisle?: string;

  @IsOptional()
  Store?: string;

  @IsOptional()
  Comments?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsNumber()
  InitialWeight?: number;

  /**
   * this property shows bought status (in app used for bought it button )
   */
  @IsOptional()
  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsNumber()
  State?: number;

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
  VendorProviderName?: VendorsProviderNamesEnum =
    VendorsProviderNamesEnum.KROGER;
}

export class UpdateProductResponseDto {
  message: UpdateProductSuccessEnum;
}

export class UpdateProductFailureDto {
  /**
   * A short code for the error that happened.
   */
  errorCode: UpdateProductErrorStatusEnum;

  /**
   * Description for error code.
   */
  message: UpdateProductErrorMsgEnum;
}
