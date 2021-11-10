import { Room } from '../../shared/module/websocket/websocket.enum';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsLoggerService } from '../../shared/module/logger/ws-logger.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { ISocketUser } from 'src/shared/interface/ISocketUser.interface';

declare module 'socket.io' {
  interface Socket {
    user: ISocketUser;
  }
}

@WebSocketGateway({
  cors: { origin: '*', methods: '*', allowedHeaders: '*' },
})
export class FamiliesWebsocketGateway implements OnGatewayDisconnect {
  @WebSocketServer() private server: Server;

  constructor(private wsLogger: WsLoggerService) {
    this.wsLogger.setContext(FamiliesWebsocketGateway.name);
  }

  handleDisconnect(client: Socket): void {
    const user = client.user;
    this.server.to(user.roomId).emit('OfflineUser', {
      message: `${user.fullName} went Offline`,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('JoinRoom')
  createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() familyId: number,
  ): string {
    const user = client.user;

    this.wsLogger.debug('JoinRoom', { familyId }, String(user.id));
    const rooms = this.server.sockets.adapter.sids.get(client.id);
    if (rooms)
      for (const room of rooms.values()) {
        room.includes(Room.Prefix) ? client.leave(room) : undefined;
      }
    client.join(`${Room.Prefix}${familyId}`);

    user.familyId = familyId;
    user.roomId = `${Room.Prefix}${familyId}`;

    this.server.to(`${Room.Prefix}${familyId}`).emit('OnlineUser', {
      message: `${user.fullName} went Online.`,
      userId: user.id,
    });
    return `${Room.Prefix}${familyId}`;
  }
}
