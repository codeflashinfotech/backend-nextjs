import { AddActivityLogSuccessEnum } from '../logs.enum';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IdDto, UpperIdDto } from '../../../shared/dto';

export class AddActivityLogBodyDto {
  /**
   * User's one of the family ids (should be user).
   */
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  family: IdDto;

  @ValidateNested()
  @Type(() => UpperIdDto)
  hub: UpperIdDto;

  @ValidateNested()
  @Type(() => UpperIdDto)
  shoppingListProduct: UpperIdDto;

  @IsNotEmpty()
  ActivityData: string;

  @IsNotEmpty()
  @IsInt()
  ActivityType: number;

  @IsNotEmpty()
  FoodName: string;

  @IsNotEmpty()
  ImageURL: string;

  @IsNotEmpty()
  Product_Identifier: string;

  @IsNotEmpty()
  @IsInt()
  ScaleNumber: number;
}

export class AddActivityLogResponseDto {
  message: AddActivityLogSuccessEnum;
}
