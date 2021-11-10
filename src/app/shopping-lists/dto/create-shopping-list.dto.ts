import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IdDto } from '../../../shared/dto';
import { CreateShoppingListSuccessEnum } from '../shopping-lists.enum';

export class CreateShoppingListDto {
  /**
   * User's one of the family ids (should be user).
   */
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  family: IdDto;
  /**
   * Name of the shopping list
   * */
  @IsNotEmpty()
  Name: string;
}

/**
 * Response object as dto
 * @class
 * */
export class CreateShoppingListDtoResponse {
  message: CreateShoppingListSuccessEnum;
}
