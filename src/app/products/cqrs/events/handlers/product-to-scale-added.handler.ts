import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LogsService } from 'src/app/logs/logs.service';
import { ProductToScaleAddedEvent } from '../impl/product-to-scale-added.event';
@EventsHandler(ProductToScaleAddedEvent)
export class ProductToScaleAddedEventHandler
  implements IEventHandler<ProductToScaleAddedEvent>
{
  constructor(private logsService: LogsService) {}
  handle(event: ProductToScaleAddedEvent) {
    const { product, userId, familyId } = event;
    this.logsService.addProductToActivityLog(product, userId, familyId, 101);
  }
}
