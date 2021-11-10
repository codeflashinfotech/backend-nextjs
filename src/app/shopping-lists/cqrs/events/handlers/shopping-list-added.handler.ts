import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ShoppingListAddedEvent } from '../impl/shopping-list-added.event';
@EventsHandler(ShoppingListAddedEvent)
export class ShoppingListAddedEventHandler
  implements IEventHandler<ShoppingListAddedEvent>
{
  handle(event: ShoppingListAddedEvent) {
    //console.log(event);
  }
}
