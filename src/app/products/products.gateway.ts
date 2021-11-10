import { Room } from '../../shared/module/websocket/websocket.enum';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { ProductAddedToCartEvent } from './cqrs/events/impl/product-added-to-cart.event';
import { map } from 'rxjs/operators';
import { WsLoggerService } from 'src/shared/module/logger/ws-logger.service';
import { ProductOnShoppingListBoughtEvent } from './cqrs/events/impl/product-on-shopping-list-bought.event';
import { ProductFromShoppingListRemoveEvent } from './cqrs/events/impl/product-from-shopping-list-removed.event';

@WebSocketGateway({
  cors: { origin: '*', methods: '*', allowedHeaders: '*' },
})
export class ProductsWebsocketGateway {
  @WebSocketServer() private server: Server;

  constructor(private wsLoggerService: WsLoggerService) {
    this.wsLoggerService.setContext(ProductsWebsocketGateway.name);
  }

  @Saga()
  productOnShoppingListBought = (
    events$: Observable<any>,
  ): Observable<void> => {
    return events$.pipe(
      ofType(ProductOnShoppingListBoughtEvent),
      map((event) => {
        this.wsLoggerService.debug(
          'ProductOnShoppingListBought',
          event,
          String(event.userId),
        );
        this.server
          .to(`${Room.Prefix}${event.familyId}`)
          .emit('ProductOnShoppingListBought', {
            message: `${event.fullName} bought ${event.product.Name} on ${event.product.shoppingList.Name}`,
            userId: event.userId,
          });
      }),
    );
  };

  @Saga()
  productRemovedFromShoppingList = (
    events$: Observable<any>,
  ): Observable<void> => {
    return events$.pipe(
      ofType(ProductFromShoppingListRemoveEvent),
      map((event) => {
        this.wsLoggerService.debug(
          'ProductRemovedFromShoppingList',
          event,
          String(event.userId),
        );
        this.server
          .to(`${Room.Prefix}${event.familyId}`)
          .emit('ProductRemovedFromShoppingList', {
            message: `${event.fullName} removed ${event.product.Name} from ${event.product.shoppingList.Name}`,
            userId: event.userId,
          });
      }),
    );
  };

  @Saga()
  productAddedToCart = (event$: Observable<any>): Observable<void> => {
    return event$.pipe(
      ofType(ProductAddedToCartEvent),
      map((event) => {
        this.wsLoggerService.debug('AddProductToCartEvent', event);
        this.server
          .to(`${Room.Prefix}${event.familyId}`)
          .emit('AddProductToCart', {
            messages: event.messages,
            userId: event.userId,
          });
      }),
    );
  };
}
