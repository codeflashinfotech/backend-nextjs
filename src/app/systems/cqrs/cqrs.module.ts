import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hub } from '../entities/hub.entity';
import { CreateHubCommandHandler } from './commands/handlers/create-hub.handler';
import { UpdateSensorsProductsCommandHandler } from './commands/handlers/update-sensors-products.handler';
import { CreateHubCommand } from './commands/impl/create-hub.command';
import { UpdateSensorsProductsCommand } from './commands/impl/update-sensors-products.command';
import { HubCreatedEventHandler } from './events/handlers/hub-created.handler';
import { SensorsProductsUpdatedEventHandler } from './events/handlers/sensors-products-updated.handler';
import { SensorProductsListModule } from 'src/shared/module/sensor-products-list/sensor-products-list.module';
import { CustomLoggerModule } from '../../../shared/module/logger/logger.module';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Hub]),
    SensorProductsListModule,
    CustomLoggerModule,
  ],
  providers: [
    CreateHubCommand,
    CreateHubCommandHandler,
    HubCreatedEventHandler,
    UpdateSensorsProductsCommand,
    UpdateSensorsProductsCommandHandler,
    SensorsProductsUpdatedEventHandler,
  ],
  exports: [CqrsModule],
})
export class SystemCqrsModule {}
