import { ShoppingListProduct } from 'src/app/systems/entities/shopping-list-products.entity';

export class AddProductToScaleCommand {
  constructor(
    public readonly product: ShoppingListProduct,
    public readonly userId: number,
    public readonly familyId: number,
  ) {}
}
