import { Room } from '../../shared/module/websocket/websocket.enum';
import { ofType, Saga } from '@nestjs/cqrs';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { WsLoggerService } from 'src/shared/module/logger/ws-logger.service';
import { ProductToShoppingListsAddedEvent } from './cqrs/events/impl/product-to-shopping-lists-added.event';
import { ShoppingListAddedEvent } from './cqrs/events/impl/shopping-list-added.event';
import { ShoppingListRemovedEvent } from './cqrs/events/impl/shopping-list-removed.event';

@WebSocketGateway({
  cors: { origin: '*', methods: '*', allowedHeaders: '*' },
})
export class ShoppingListsWebsocketGateway {
  @WebSocketServer() private server: Server;

  constructor(private wsLoggerService: WsLoggerService) {
    this.wsLoggerService.setContext(ShoppingListsWebsocketGateway.name);
  }

  @Saga()
  shoppingListAdded = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(ShoppingListAddedEvent),
      map((event) => {
        this.wsLoggerService.debug(
          'ShoppingListAdded',
          event,
          String(event.userId),
        );
        this.server
          .to(`${Room.Prefix}${event.familyId}`)
          .emit('ShoppingListAdded', {
            message: `${event.fullName} added the ${event.shoppingListName} shopping list`,
            userId: event.userId,
          });
      }),
    );
  };

  @Saga()
  productAddedToShoppingList = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(ProductToShoppingListsAddedEvent),
      map((event) => {
        this.wsLoggerService.debug(
          'ProductAddedToShoppingList',
          event,
          String(event.userId),
        );
        this.server
          .to(`${Room.Prefix}${event.familyId}`)
          .emit('ProductAddedToShoppingList', {
            message: `${event.fullName} added ${event.product.Name} to ${event.product.shoppingList.Name}`,
            userId: event.userId,
          });
      }),
    );
  };

  @Saga()
  shoppingListRemoved = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(ShoppingListRemovedEvent),
      map((event) => {
        this.wsLoggerService.debug(
          'ShoppingListRemoved',
          event,
          String(event.userId),
        );
        this.server
          .to(`${Room.Prefix}${event.familyId}`)
          .emit('ShoppingListRemoved', {
            message: `${event.fullName} removed the ${event.shoppingListName} shopping list`,
            userId: event.userId,
          });
      }),
    );
  };
}
