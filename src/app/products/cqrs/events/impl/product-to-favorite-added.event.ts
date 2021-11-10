import { FavoriteFoods } from 'src/app/products/entities/favorite.foods.entity';

export class ProductToFavoriteAddedEvent {
  constructor(
    public readonly product: FavoriteFoods,
    public readonly familyId: number,
    public readonly userId: number,
  ) {}
}
