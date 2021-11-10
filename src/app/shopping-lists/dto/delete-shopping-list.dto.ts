import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IdDto } from '../../../shared/dto';
import { DeleteShoppingListSuccessEnum } from '../shopping-lists.enum';

export class DeleteShoppingListParamDto {
  /**
   * Id of the shopping list
   * */
  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsInt()
  listId: number;
}

export class DeleteShoppingListBodyDto {
  /**
   * User's family (role should be user)
   * */
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  family: IdDto;
}

export class DeleteShoppingListResponseDto {
  message: DeleteShoppingListSuccessEnum;
}
