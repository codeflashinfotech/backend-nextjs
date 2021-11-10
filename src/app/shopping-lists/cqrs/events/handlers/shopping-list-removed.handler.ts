import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ShoppingListRemovedEvent } from '../impl/shopping-list-removed.event';
@EventsHandler(ShoppingListRemovedEvent)
export class ShoppingListRemovedEventHandler
  implements IEventHandler<ShoppingListRemovedEvent>
{
  handle(event: ShoppingListRemovedEvent) {
    //console.log(event);
  }
}
