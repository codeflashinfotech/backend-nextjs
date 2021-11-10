import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingListProduct } from 'src/app/systems/entities/shopping-list-products.entity';
import { Repository } from 'typeorm';
import { ProductFromScaleRemovedEvent } from '../../events/impl/product-from-scale-removed.event';
import { RemoveProductFromScaleCommand } from '../impl/remove-product-from-scale.command';

@CommandHandler(RemoveProductFromScaleCommand)
export class RemoveProductFromScaleCommandHandler
  implements ICommandHandler<RemoveProductFromScaleCommand>
{
  constructor(
    private eventBus: EventBus,
    @InjectRepository(ShoppingListProduct)
    private shoppingListProductRepo: Repository<ShoppingListProduct>,
  ) {}
  async execute(command: RemoveProductFromScaleCommand) {
    let { product } = command;
    const { userId, familyId, productId } = command;
    if (product) {
      this.eventBus.publish(
        new ProductFromScaleRemovedEvent(product, familyId, userId),
      );
      return;
    }

    product = await this.shoppingListProductRepo.findOne({
      Id: productId,
    });
    if (product.State == 0)
      this.eventBus.publish(
        new ProductFromScaleRemovedEvent(product, familyId, userId),
      );
  }
}
