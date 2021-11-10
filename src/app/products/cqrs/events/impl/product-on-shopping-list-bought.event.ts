import { ShoppingListProduct } from 'src/app/systems/entities/shopping-list-products.entity';

export class ProductOnShoppingListBoughtEvent {
  constructor(
    public readonly product: ShoppingListProduct,
    public readonly familyId: number,
    public readonly userId: number,
    public readonly fullName: string,
  ) {}
}
