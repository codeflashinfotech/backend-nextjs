import { ShoppingListProduct } from 'src/app/systems/entities/shopping-list-products.entity';

export class ProductOnInMyPantryBoughtEvent {
  constructor(
    public readonly product: ShoppingListProduct,
    public readonly familyId: number,
    public readonly userId: number,
  ) {}
}
