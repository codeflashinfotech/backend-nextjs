import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteFoods } from 'src/app/products/entities/favorite.foods.entity';
import { Repository } from 'typeorm';
import { ProductToFavoriteAddedEvent } from '../../events/impl/product-to-favorite-added.event';
import { AddProductToFavoriteCommand } from '../impl/add-product-to-favorite.command';

@CommandHandler(AddProductToFavoriteCommand)
export class AddProductToFavoriteCommandHandler
  implements ICommandHandler<AddProductToFavoriteCommand>
{
  constructor(
    private eventBus: EventBus,
    @InjectRepository(FavoriteFoods)
    private favoriteFoodsRepo: Repository<FavoriteFoods>,
  ) {}
  async execute(command: AddProductToFavoriteCommand) {
    const { foodId, userId, familyId } = command;
    const product = await this.favoriteFoodsRepo.findOne({
      Id: foodId,
    });
    this.eventBus.publish(
      new ProductToFavoriteAddedEvent(product, familyId, userId),
    );
  }
}
