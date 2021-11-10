import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitConvert } from 'src/shared/utils/unit-convert.util';
import { FoodActivityLog } from '../logs/entities/food-activity-log.entity';
import { HistoriesController } from './histories.controller';
import { HistoriesService } from './histories.service';

@Module({
  imports: [TypeOrmModule.forFeature([FoodActivityLog])],
  controllers: [HistoriesController],
  providers: [HistoriesService, UnitConvert],
})
export class HistoriesModule {}
