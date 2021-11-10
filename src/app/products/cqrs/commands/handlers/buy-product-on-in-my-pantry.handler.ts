import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProductOnInMyPantryBoughtEvent } from '../../events/impl/product-on-in-my-pantry-bought.event';
import { BuyProductOnInMyPantryCommand } from '../impl/buy-product-on-in-my-pantry.command';

@CommandHandler(BuyProductOnInMyPantryCommand)
export class BuyProductOnInMyPantryCommandHandler
  implements ICommandHandler<BuyProductOnInMyPantryCommand>
{
  constructor(private eventBus: EventBus) {}
  async execute(command: BuyProductOnInMyPantryCommand) {
    const { product, userId, familyId } = command;
    this.eventBus.publish(
      new ProductOnInMyPantryBoughtEvent(product, familyId, userId),
    );
  }
}
