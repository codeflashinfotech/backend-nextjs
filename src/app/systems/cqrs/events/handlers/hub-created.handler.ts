import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { HubCreatedEvent } from '../impl/hub-created.event';

@EventsHandler(HubCreatedEvent)
export class HubCreatedEventHandler implements IEventHandler<HubCreatedEvent> {
  handle(event: HubCreatedEvent) {
    //console.log('HubCreatedEvent...', event);
  }
}
