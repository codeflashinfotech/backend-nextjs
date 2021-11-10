import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from 'src/app/logs/logs.module';
import { ShoppingListProduct } from 'src/app/systems/entities/shopping-list-products.entity';
import { AddProductToShoppingListsCommandHandler } from './commands/handlers/add-product-to-shopping-lists.handler';
import { AddShoppingListCommandHandler } from './commands/handlers/add-shopping-list.handler';
import { RemoveShoppingListCommandHandler } from './commands/handlers/remove-shopping-list.handler';
import { ProductToShoppingListsAddedEventHandler } from './events/handlers/product-to-shopping-lists-added.handler';
import { ShoppingListAddedEventHandler } from './events/handlers/shopping-list-added.handler';
import { ShoppingListRemovedEventHandler } from './events/handlers/shopping-list-removed.handler';
@Module({
  imports: [
    CqrsModule,
    LogsModule,
    TypeOrmModule.forFeature([ShoppingListProduct]),
  ],
  providers: [
    AddProductToShoppingListsCommandHandler,
    ProductToShoppingListsAddedEventHandler,
    AddShoppingListCommandHandler,
    ShoppingListAddedEventHandler,
    RemoveShoppingListCommandHandler,
    ShoppingListRemovedEventHandler,
  ],
  exports: [CqrsModule],
})
export class ShoppingListsCqrsModule {}
