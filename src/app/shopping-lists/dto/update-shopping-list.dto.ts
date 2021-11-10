import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IdDto } from '../../../shared/dto';
import {
  UpdateShoppingListErrorMsgEnum,
  UpdateShoppingListErrorStatusEnum,
  UpdateShoppingListSuccessEnum,
} from '../shopping-lists.enum';

export class UpdateShoppingListParamDto {
  /**
   * Id of the shopping list
   * */
  @IsNotEmpty()
  @Transform((value) => Number.parseInt(value))
  @IsInt()
  listId: number;
}

export class UpdateShoppingListBodyDto {
  /**
   * name of the shopping list
   * */
  @IsNotEmpty()
  Name: string;

  /**
   * User's family (role should be user)
   * */
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  family: IdDto;
}

export class UpdateShoppingListResponseDto {
  message: UpdateShoppingListSuccessEnum;
}

export class UpdateShoppingListFailureDto {
  /**
   * A short code for the error that happened.
   */
  errorCode: UpdateShoppingListErrorStatusEnum;

  /**
   * Description for error code.
   */
  message: UpdateShoppingListErrorMsgEnum;
}
