import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import { Socket } from 'socket.io';

/**
 * in getRequest method we return socket Client instead of http Request for ws Context
 * and then nest knows where to attach user object.
 * also we extract the authorization header from ws header and pass it to the http header,
 * then nest knows to behave as a http request and passport can get the token and decode it
 */
@Injectable()
export class WsJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers['authorization'] as string;
    const req = context.switchToHttp().getRequest<Request>();
    req.headers = {};
    req.headers.authorization = token;
    return client;
  }

  async canActivate(context: ExecutionContext) {
    try {
      return (await super.canActivate(context).valueOf()) as boolean;
    } catch (exception) {
      throw new WsException('unauthorized');
    }
  }
}
