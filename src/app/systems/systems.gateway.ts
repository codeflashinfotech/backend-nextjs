import { ofType, Saga } from '@nestjs/cqrs';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { WsLoggerService } from 'src/shared/module/logger/ws-logger.service';
import { HubCreatedEvent } from './cqrs/events/impl/hub-created.event';
import { SensorsProductsUpdatedEvent } from './cqrs/events/impl/sensors-products-updated.event';
import { Room } from '../../shared/module/websocket/websocket.enum';

@WebSocketGateway({
  cors: { origin: '*', methods: '*', allowedHeaders: '*' },
})
export class SystemWebsocketGateway {
  @WebSocketServer() private server: Server;

  constructor(private wsLoggerService: WsLoggerService) {
    this.wsLoggerService.setContext(SystemWebsocketGateway.name);
  }

  @Saga()
  hubCreated = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(HubCreatedEvent),
      delay(1000),
      map((event) => {
        this.wsLoggerService.debug('HubCreated', event);
        this.server
          .to(`${Room.Prefix}${event.FamilyId}`)
          .emit('HubCreatedEvent', {
            message: `PantryOn System ${event.HubName} has been Created. Finalizing setup.`,
            userId: 0,
          });
      }),
    );
  };

  @Saga()
  productsUpdated = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(SensorsProductsUpdatedEvent),
      delay(1000),
      map((event) => {
        this.wsLoggerService.debug('SensorsProductsUpdated', event);
        this.server
          .to(`${Room.Prefix}${event.familyId}`)
          .emit('SensorsProductsUpdatedEvent', {
            message: 'Sensors Products Updated',
            userId: 0,
          });
      }),
    );
  };
}
