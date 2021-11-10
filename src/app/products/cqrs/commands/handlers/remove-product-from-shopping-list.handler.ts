import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProductFromShoppingListRemoveEvent } from '../../events/impl/product-from-shopping-list-removed.event';
import { RemoveProductFromShoppingListCommand } from '../impl/remove-product-from-shopping-list.command';

@CommandHandler(RemoveProductFromShoppingListCommand)
export class RemoveProductFromShoppingListCommandHandler
  implements ICommandHandler<RemoveProductFromShoppingListCommand>
{
  constructor(private eventBus: EventBus) {}
  async execute(command: RemoveProductFromShoppingListCommand) {
    const { product, userId, familyId, fullName } = command;
    this.eventBus.publish(
      new ProductFromShoppingListRemoveEvent(
        product,
        familyId,
        userId,
        fullName,
      ),
    );
  }
}
