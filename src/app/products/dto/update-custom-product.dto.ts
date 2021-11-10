import {
  CreateNewProductErrorMsgEnum,
  CreateNewProductErrorStatusEnum,
  UpdateCustomProductErrorMsgEnum,
  UpdateCustomProductErrorStatusEnum,
  UpdateCustomProductSuccessEnum,
} from '../products.enum';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileInterface } from '../../../shared/module/upload/upload.interface';
import { Transform } from 'class-transformer';

export class UpdateCustomProductResponseDto {
  message: UpdateCustomProductSuccessEnum;
}

export class UpdateCustomProductQueryDto {
  @IsNotEmpty()
  familyId: number;
}

export class UpdateCustomProductBodyDto {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  file?: FileInterface;

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

  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  @IsNumber()
  Quantity?: number;

  @IsOptional()
  Store?: string;

  @IsOptional()
  Aisle?: string;

  @IsOptional()
  @Transform((value) => Number.parseFloat(value))
  @IsNumber()
  Price?: number;
}

export class UpdateCustomProductFailureDto {
  /**
   * A short code for the error that happened.
   */
  errorCode: UpdateCustomProductErrorStatusEnum;

  /**
   * Description for error code.
   */
  message: UpdateCustomProductErrorMsgEnum;
}

export class UpdateCustomProductParamDto {
  @IsNotEmpty()
  customProductId: number;
}
