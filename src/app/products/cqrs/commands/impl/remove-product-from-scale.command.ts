import { ShoppingListProduct } from 'src/app/systems/entities/shopping-list-products.entity';

export class RemoveProductFromScaleCommand {
  constructor(
    public readonly userId: number,
    public readonly familyId: number,
    public readonly product?: ShoppingListProduct,
    public readonly productId?: number,
  ) {}
}
