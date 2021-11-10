import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SensorsProductsUpdatedEvent } from '../impl/sensors-products-updated.event';

@EventsHandler(SensorsProductsUpdatedEvent)
export class SensorsProductsUpdatedEventHandler
  implements IEventHandler<SensorsProductsUpdatedEvent>
{
  handle(event: SensorsProductsUpdatedEvent) {
    //console.log('SensorsProductsUpdatedEvent...', event);
  }
}
