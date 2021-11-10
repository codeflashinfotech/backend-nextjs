import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LogsService } from 'src/app/logs/logs.service';
import { ProductOnShoppingListBoughtEvent } from 'src/app/products/cqrs/events/impl/product-on-shopping-list-bought.event';

@EventsHandler(ProductOnShoppingListBoughtEvent)
export class ProductOnShoppingListBoughtEventHandler
  implements IEventHandler<ProductOnShoppingListBoughtEvent>
{
  constructor(private logsService: LogsService) {}
  handle(event: ProductOnShoppingListBoughtEvent) {
    const { product, userId, familyId } = event;
    this.logsService.addProductToActivityLog(product, userId, familyId, 200);
  }
}
