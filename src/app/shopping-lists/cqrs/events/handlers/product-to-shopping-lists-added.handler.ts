import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LogsService } from 'src/app/logs/logs.service';
import { ProductToShoppingListsAddedEvent } from '../impl/product-to-shopping-lists-added.event';
@EventsHandler(ProductToShoppingListsAddedEvent)
export class ProductToShoppingListsAddedEventHandler
  implements IEventHandler<ProductToShoppingListsAddedEvent>
{
  constructor(private logsService: LogsService) {}
  handle(event: ProductToShoppingListsAddedEvent) {
    const { product, userId, familyId } = event;
    this.logsService.addProductToActivityLog(product, userId, familyId, 100);
  }
}
