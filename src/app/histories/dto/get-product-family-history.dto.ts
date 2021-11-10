import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetProductFamilyHistoryQueryDto {
  @IsNotEmpty()
  @IsString()
  product_Identifier: string;

  @IsNotEmpty()
  familyId: number;

  @IsNotEmpty()
  days: number;
}
