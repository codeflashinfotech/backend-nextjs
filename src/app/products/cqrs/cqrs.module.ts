import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from 'src/app/logs/logs.module';
import { ShoppingListProduct } from 'src/app/systems/entities/shopping-list-products.entity';
import { AddProductToScaleCommandHandler } from './commands/handlers/add-product-to-scale.handler';
import { RemoveProductFromScaleCommandHandler } from './commands/handlers/remove-product-from-scale.handler';
import { RemoveProductFromShoppingListCommandHandler } from './commands/handlers/remove-product-from-shopping-list.handler';
import { BuyProductOnInMyPantryCommandHandler } from './commands/handlers/buy-product-on-in-my-pantry.handler';
import { BuyProductOnShoppingListCommandHandler } from './commands/handlers/buy-product-on-shopping-list.handler';
import { ProductToScaleAddedEventHandler } from './events/handlers/product-to-scale-added.handler';
import { ProductFromScaleRemovedEventHandler } from './events/handlers/product-from-scale-removed.handler';
import { ProductFromShoppingListRemoveEventHandler } from './events/handlers/product-from-shopping-list-removed.handler';
import { ProductOnInMyPantryBoughtEventHandler } from './events/handlers/product-on-in-my-pantry-bought.handler';
import { ProductOnShoppingListBoughtEventHandler } from './events/handlers/product-on-shopping-list-bought.handler';
import { FavoriteFoods } from '../entities/favorite.foods.entity';
import { AddProductToFavoriteCommandHandler } from './commands/handlers/add-product-to-favorite.handler';
import { ProductToFavoriteAddedEventHandler } from './events/handlers/product-to-favorite-added.handler';
import { AddProductToCartCommandHandler } from './commands/handlers/add-product-to-cart.handler';
import { ProductAddedToCartEventHandler } from './events/handlers/product-added-to-cart.handler';
import { User } from '../../users/users.entity';

@Module({
  imports: [
    CqrsModule,
    LogsModule,
    TypeOrmModule.forFeature([ShoppingListProduct, FavoriteFoods, User]),
  ],
  providers: [
    RemoveProductFromShoppingListCommandHandler,
    ProductFromShoppingListRemoveEventHandler,

    BuyProductOnInMyPantryCommandHandler,
    ProductOnInMyPantryBoughtEventHandler,

    BuyProductOnShoppingListCommandHandler,
    ProductOnShoppingListBoughtEventHandler,

    RemoveProductFromScaleCommandHandler,
    ProductFromScaleRemovedEventHandler,

    AddProductToScaleCommandHandler,
    ProductToScaleAddedEventHandler,

    AddProductToFavoriteCommandHandler,
    ProductToFavoriteAddedEventHandler,

    AddProductToCartCommandHandler,
    ProductAddedToCartEventHandler,
  ],
  exports: [CqrsModule],
})
export class ProductsCqrsModule {}
