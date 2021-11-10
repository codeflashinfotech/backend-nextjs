import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddShoppingListCommand } from '../../commands/impl/add-shopping-list.command';
import { ShoppingListAddedEvent } from '../../events/impl/shopping-list-added.event';

@CommandHandler(AddShoppingListCommand)
export class AddShoppingListCommandHandler
  implements ICommandHandler<AddShoppingListCommand>
{
  constructor(private eventBus: EventBus) {}
  async execute(command: AddShoppingListCommand) {
    const { shoppingListName, familyId, userId, fullName } = command;
    this.eventBus.publish(
      new ShoppingListAddedEvent(shoppingListName, familyId, userId, fullName),
    );
  }
}
