import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { FoodActivityLog } from './entities/food-activity-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log, FoodActivityLog])],
  providers: [LogsService],
  exports: [LogsService],
  controllers: [LogsController],
})
export class LogsModule {}
