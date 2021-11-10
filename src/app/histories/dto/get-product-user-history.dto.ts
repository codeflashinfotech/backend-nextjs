import { IsNotEmpty, IsString } from 'class-validator';

export class GetProductUserHistoryQueryDto {
  @IsNotEmpty()
  @IsString()
  product_Identifier: string;
}
