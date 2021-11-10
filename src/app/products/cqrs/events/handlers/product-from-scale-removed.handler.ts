import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LogsService } from 'src/app/logs/logs.service';
import { ProductFromScaleRemovedEvent } from '../impl/product-from-scale-removed.event';
@EventsHandler(ProductFromScaleRemovedEvent)
export class ProductFromScaleRemovedEventHandler
  implements IEventHandler<ProductFromScaleRemovedEvent>
{
  constructor(private logsService: LogsService) {}
  handle(event: ProductFromScaleRemovedEvent) {
    const { product, userId, familyId } = event;
    this.logsService.addProductToActivityLog(product, userId, familyId, 301);
  }
}
