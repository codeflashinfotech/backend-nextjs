import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomFoods } from '../products/entities/custom-foods.entity';
import { ShoppingListProduct } from '../systems/entities/shopping-list-products.entity';
import { ShoppingList } from '../systems/entities/shopping-list.entity';
import { ShoppingListsController } from './shopping-lists.controller';
import { ShoppingListsService } from './shopping-lists.service';
import { LogsModule } from '../logs/logs.module';
import { UploadModule } from '../../shared/module/upload/upload.module';
import { AWSConfigModule } from 'src/config/aws/config.module';
import { ShoppingListsCqrsModule } from './cqrs/cqrs.module';
import { ShoppingListsWebsocketGateway } from './shopping-lists.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingList, ShoppingListProduct, CustomFoods]),
    LogsModule,
    UploadModule,
    AWSConfigModule,
    ShoppingListsCqrsModule,
  ],
  controllers: [ShoppingListsController],
  providers: [ShoppingListsService, ShoppingListsWebsocketGateway],
  exports: [ShoppingListsService],
})
export class ShoppingListsModule {}
