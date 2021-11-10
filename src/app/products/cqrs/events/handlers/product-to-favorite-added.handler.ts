import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LogsService } from 'src/app/logs/logs.service';
import { ProductToFavoriteAddedEvent } from '../impl/product-to-favorite-added.event';
@EventsHandler(ProductToFavoriteAddedEvent)
export class ProductToFavoriteAddedEventHandler
  implements IEventHandler<ProductToFavoriteAddedEvent>
{
  constructor(private logsService: LogsService) {}
  handle(event: ProductToFavoriteAddedEvent) {
    const { product, userId, familyId } = event;
    this.logsService.addFavoriteProductToActivityLog(
      product,
      userId,
      familyId,
      102,
    );
  }
}
