import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  CreateNewProductErrorMsgEnum,
  CreateNewProductErrorStatusEnum,
  CreateNewProductSuccessEnum,
  UpdateProductErrorMsgEnum,
  UpdateProductErrorStatusEnum,
} from '../products.enum';
import { ApiProperty } from '@nestjs/swagger';
import { FileInterface } from '../../../shared/module/upload/upload.interface';

export class CreateNewProductQueryDto {
  @IsNotEmpty()
  familyId: number;
}

export class CreateNewProductBodyDto {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  file?: FileInterface;

  @IsString()
  Product_Identifier: string;

  @IsOptional()
  DataSource?: string;

  @IsOptional()
  Food?: string;

  @IsOptional()
  Comments?: string;

  /**
   * it is FoodName in custom list
   * */
  @IsOptional()
  Name?: string;

  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsNumber()
  Quantity: number;

  @IsOptional()
  Store?: string;

  @IsOptional()
  Aisle?: string;

  @IsNotEmpty()
  @Transform((value) => Number.parseFloat(value))
  @IsNumber()
  Price: number;
}

export class CreateNewProductResponseDto {
  message: CreateNewProductSuccessEnum;
}

export class CreateNewProductFailureDto {
  /**
   * A short code for the error that happened.
   */
  errorCode: CreateNewProductErrorStatusEnum;

  /**
   * Description for error code.
   */
  message: CreateNewProductErrorMsgEnum;
}
