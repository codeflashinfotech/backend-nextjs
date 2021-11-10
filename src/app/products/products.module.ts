import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hub } from '../systems/entities/hub.entity';
import { ShoppingListProduct } from '../systems/entities/shopping-list-products.entity';
import { SystemsModule } from '../systems/systems.module';
import { CustomFoods } from './entities/custom-foods.entity';
import { FavoriteFoods } from './entities/favorite.foods.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ShoppingListsModule } from '../shopping-lists/shopping-lists.module';
import { UploadModule } from '../../shared/module/upload/upload.module';
import { VendorsProviderModule } from 'src/providers/vendors/vendors.module';
import { AWSConfigModule } from 'src/config/aws/config.module';
import { UnitConvert } from '../../shared/utils/unit-convert.util';
import { ProductsCqrsModule } from './cqrs/cqrs.module';
import { SensorProductsListModule } from '../../shared/module/sensor-products-list/sensor-products-list.module';
import { SettingsConfigModule } from 'src/config/settings/config.module';
import { ProductsWebsocketGateway } from './products.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hub,
      FavoriteFoods,
      ShoppingListProduct,
      CustomFoods,
    ]),
    SystemsModule,
    ShoppingListsModule,
    UploadModule,
    VendorsProviderModule,
    AWSConfigModule,
    ProductsCqrsModule,
    SensorProductsListModule,
    SettingsConfigModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsWebsocketGateway, UnitConvert],
})
export class ProductsModule {}
