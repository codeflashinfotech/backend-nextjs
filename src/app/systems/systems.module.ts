import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthConfigModule } from 'src/config/auth/config.module';
import { LogsModule } from '../logs/logs.module';
import { SystemCqrsModule } from './cqrs/cqrs.module';
import { HubDataLatest } from './entities/hub-data-latest.entity';
import { Hub } from './entities/hub.entity';
import { ShadowReplication } from './entities/shadow-replication.entity';
import { ShoppingListHub } from './entities/shopping-list-hub.entity';
import { ShoppingListProduct } from './entities/shopping-list-products.entity';
import { SystemsController } from './systems.controller';
import { SystemWebsocketGateway } from './systems.gateway';
import { SystemsService } from './systems.service';
import { ShoppingListInitialProduct } from './entities/shopping-list-initial-product.entity';
import { lockerRequest, LOCKER } from './systems.const';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hub,
      HubDataLatest,
      ShoppingListHub,
      ShoppingListProduct,
      ShadowReplication,
      ShoppingListInitialProduct,
    ]),
    LogsModule,
    SystemCqrsModule,
    AuthConfigModule,
  ],
  controllers: [SystemsController],
  providers: [
    SystemsService,
    SystemWebsocketGateway,
    { provide: LOCKER, useValue: lockerRequest },
  ],
})
export class SystemsModule {}
