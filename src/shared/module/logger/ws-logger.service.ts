import {
  ConsoleLogger,
  Inject,
  Injectable,
  LoggerService,
  Scope,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppConfigService } from 'src/config/app/config.service';
import { Logger as WinstonLogger } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class WsLoggerService extends ConsoleLogger implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: WinstonLogger,
    private appConfigService: AppConfigService,
  ) {
    super();
  }
  context: string;
  setContext(context: string) {
    this.context = context;
    super.setContext(context);
  }
  throwType = {
    WsException: WsException,
  };

  debug(message: string, meta?: any, userId?: string) {
    if (this.appConfigService.DEBUG) {
      this.winstonLogger.debug(message, {
        meta,
        context: this.context,
        userId,
      });
    }
  }

  error(
    message: string,
    meta?: any,
    userId?: string,
    throwType = 'WsException',
  ) {
    if (meta) {
      this.winstonLogger.error(message, {
        meta,
        context: this.context,
        userId,
      });
      throw new this.throwType[throwType](meta);
    }
  }
}
