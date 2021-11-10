import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProductAddedToCartEvent } from '../impl/product-added-to-cart.event';

@EventsHandler(ProductAddedToCartEvent)
export class ProductAddedToCartEventHandler
  implements IEventHandler<ProductAddedToCartEvent>
{
  handle(event: ProductAddedToCartEvent) {
    // console.log(event);
  }
}
