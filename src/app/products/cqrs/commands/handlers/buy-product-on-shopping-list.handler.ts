import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProductOnShoppingListBoughtEvent } from '../../events/impl/product-on-shopping-list-bought.event';
import { BuyProductOnShoppingListCommand } from '../impl/buy-product-on-shopping-list.command';

@CommandHandler(BuyProductOnShoppingListCommand)
export class BuyProductOnShoppingListCommandHandler
  implements ICommandHandler<BuyProductOnShoppingListCommand>
{
  constructor(private eventBus: EventBus) {}
  async execute(command: BuyProductOnShoppingListCommand) {
    const { product, userId, familyId, fullName } = command;
    this.eventBus.publish(
      new ProductOnShoppingListBoughtEvent(product, familyId, userId, fullName),
    );
  }
}
