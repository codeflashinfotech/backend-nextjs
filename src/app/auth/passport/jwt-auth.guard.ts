import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HttpJwtAuthGuard } from './context-jwt-auth-guards/http-jwt-auth.guard';
import { WsJwtAuthGuard } from './context-jwt-auth-guards/ws-jwt-auth.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private httpJwtAuthGuard: HttpJwtAuthGuard,
    private wsJwtAuthGuard: WsJwtAuthGuard,
  ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    return this[`${context.getType()}JwtAuthGuard`].getRequest(context);
  }

  canActivate(context: ExecutionContext) {
    return this[`${context.getType()}JwtAuthGuard`].canActivate(context);
  }
}
