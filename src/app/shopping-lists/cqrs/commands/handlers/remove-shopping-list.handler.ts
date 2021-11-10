import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RemoveShoppingListCommand } from '../../commands/impl/remove-shopping-list.command';
import { ShoppingListRemovedEvent } from '../../events/impl/shopping-list-removed.event';

@CommandHandler(RemoveShoppingListCommand)
export class RemoveShoppingListCommandHandler
  implements ICommandHandler<RemoveShoppingListCommand>
{
  constructor(private eventBus: EventBus) {}
  async execute(command: RemoveShoppingListCommand) {
    const { shoppingListName, familyId, userId, fullName } = command;
    this.eventBus.publish(
      new ShoppingListRemovedEvent(
        shoppingListName,
        familyId,
        userId,
        fullName,
      ),
    );
  }
}
