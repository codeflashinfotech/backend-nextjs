import { UpdateShoppingListWeightIndexSuccessEnum } from '../shopping-lists.enum';
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IdDto } from '../../../shared/dto';

export class UpdateWeightIndexParamDto {
  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsInt()
  shoppingListId: number;
}

export class UpdateWeightIndexBodyDto {
  /**
   * User's one of the family ids (should be user).
   */
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  family: IdDto;

  @IsNotEmpty()
  @IsInt()
  Weight: number;

  @IsNotEmpty()
  @IsInt()
  SelectedWeightIndex: number;
}

export class UpdateWeightIndexQueryDto {
  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsInt()
  ScaleNumber: number;

  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsInt()
  hubId: number;
}

export class UpdateWeightIndexResponseDto {
  message: UpdateShoppingListWeightIndexSuccessEnum;
}
