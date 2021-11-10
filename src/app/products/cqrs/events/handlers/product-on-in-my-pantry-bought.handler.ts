import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LogsService } from 'src/app/logs/logs.service';
import { ProductOnInMyPantryBoughtEvent } from 'src/app/products/cqrs/events/impl/product-on-in-my-pantry-bought.event';

@EventsHandler(ProductOnInMyPantryBoughtEvent)
export class ProductOnInMyPantryBoughtEventHandler
  implements IEventHandler<ProductOnInMyPantryBoughtEvent>
{
  constructor(private logsService: LogsService) {}
  handle(event: ProductOnInMyPantryBoughtEvent) {
    const { product, userId, familyId } = event;
    this.logsService.addProductToActivityLog(product, userId, familyId, 201);
  }
}
