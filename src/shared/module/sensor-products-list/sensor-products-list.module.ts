import { Module } from '@nestjs/common';
import { SensorProductsListService } from './sensor-products-list.service';
import { UnitConvert } from '../../utils/unit-convert.util';

@Module({
  providers: [SensorProductsListService, UnitConvert],
  exports: [SensorProductsListService],
})
export class SensorProductsListModule {}
