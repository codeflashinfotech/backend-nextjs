import { IsInt, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';
import { ShoppingList } from '../../systems/entities/shopping-list.entity';

export class GetShoppingListDto {
  /**
   * User's one of the family ids (should be user).
   * */
  @IsNotEmpty()
  @Transform((value: string) => Number.parseInt(value))
  @IsInt()
  familyId: number;
}

export class GetShoppingListResponseDTO extends OmitType(ShoppingList, [
  'user',
  'family',
]) {
  /**
   * ProductList is stringify json (because some problem is useless)
   */
  ProductList: string;
  /**
   * instead of ProductList should use shoppingListProducts (shopping list product's comes in shoppingListProducts )
   * in shoppingListProducts favorite is -1 (integer) or Product_Identifier
   */
  shoppingListProducts: Array<any>;
}
