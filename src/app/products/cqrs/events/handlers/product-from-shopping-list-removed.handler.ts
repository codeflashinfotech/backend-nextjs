import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LogsService } from 'src/app/logs/logs.service';
import { ProductFromShoppingListRemoveEvent } from 'src/app/products/cqrs/events/impl/product-from-shopping-list-removed.event';

@EventsHandler(ProductFromShoppingListRemoveEvent)
export class ProductFromShoppingListRemoveEventHandler
  implements IEventHandler<ProductFromShoppingListRemoveEvent>
{
  constructor(private logsService: LogsService) {}
  handle(event: ProductFromShoppingListRemoveEvent) {
    const { product, userId, familyId } = event;
    this.logsService.addProductToActivityLog(product, userId, familyId, 300);
  }
}
