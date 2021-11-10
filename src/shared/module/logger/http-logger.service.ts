import {
  BadRequestException,
  ConsoleLogger,
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppConfigService } from 'src/config/app/config.service';
import { Logger as WinstonLogger } from 'winston';
// Types
type ThrowType =
  | 'InternalServerErrorException'
  | 'UnprocessableEntityException'
  | 'BadRequestException';
@Injectable({ scope: Scope.REQUEST })
export class HttpLoggerService extends ConsoleLogger implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: WinstonLogger,
    private appConfigService: AppConfigService,
    @Inject(REQUEST) private request,
  ) {
    super();
  }
  throwType = {
    InternalServerErrorException: InternalServerErrorException,
    UnprocessableEntityException: UnprocessableEntityException,
    BadRequestException: BadRequestException,
  };

  debug(message: string, meta?: any, context?: string) {
    if (this.appConfigService.DEBUG) {
      const userId = this.request?.user?.id;
      this.winstonLogger.debug(message, {
        meta,
        context,
        userId,
      });
    }
  }
  /**
   * @description log errors
   *
   * */
  error(
    message: string,
    meta?: any,
    context?: string,
    throwType: ThrowType = 'InternalServerErrorException',
  ) {
    if (meta) {
      const userId = this.request?.user?.id;
      this.winstonLogger.error(message, {
        meta,
        context,
        userId,
      });
      throw new this.throwType[throwType](meta);
    }
  }
}
