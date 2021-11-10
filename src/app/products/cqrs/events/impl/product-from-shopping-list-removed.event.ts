import { ShoppingListProduct } from 'src/app/systems/entities/shopping-list-products.entity';

export class ProductFromShoppingListRemoveEvent {
  constructor(
    public readonly product: ShoppingListProduct,
    public readonly familyId: number,
    public readonly userId: number,
    public readonly fullName: string,
  ) {}
}
