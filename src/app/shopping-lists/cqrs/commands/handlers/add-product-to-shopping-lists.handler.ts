import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProductToShoppingListsAddedEvent } from '../../events/impl/product-to-shopping-lists-added.event';
import { AddProductToShoppingListsCommand } from '../../commands/impl/add-product-to-shopping-lists.command';
import { InjectRepository } from '@nestjs/typeorm';
import { ShoppingListProduct } from 'src/app/systems/entities/shopping-list-products.entity';
import { Repository } from 'typeorm';
import to from 'await-to-js';
import { ShoppingList } from 'src/app/systems/entities/shopping-list.entity';
import { ShoppingListHub } from 'src/app/systems/entities/shopping-list-hub.entity';

@CommandHandler(AddProductToShoppingListsCommand)
export class AddProductToShoppingListsCommandHandler
  implements ICommandHandler<AddProductToShoppingListsCommand>
{
  constructor(
    private eventBus: EventBus,
    @InjectRepository(ShoppingListProduct)
    private shoppingListProductRepo: Repository<ShoppingListProduct>,
  ) {}
  async execute(command: AddProductToShoppingListsCommand) {
    const { productId, userId, familyId, fullName } = command;
    const tempProduct = await this.shoppingListProductRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'ShoppingList',
        'shoppingList',
        'product.ShoppingListId=shoppingList.Id',
      )
      .leftJoinAndSelect(
        'ShoppingListHub',
        'shoppingListHub',
        'product.ShoppingListId=shoppingListHub.Id',
      )
      .where('product.Id=:productId AND product.Active=1', {
        productId: productId,
      })
      .getRawOne();
    const product = new ShoppingListProduct();
    if (tempProduct) {
      product['shoppingList'] = new ShoppingList();
      product['shoppingListHub'] = new ShoppingListHub();
      for (const prop in tempProduct) {
        if (prop.includes('product_'))
          product[prop.replace('product_', '')] = tempProduct[prop];
        if (prop.includes('shoppingList_'))
          product['shoppingList'][prop.replace('shoppingList_', '')] =
            tempProduct[prop];
        if (prop.includes('shoppingListHub_'))
          product['shoppingListHub'][prop.replace('shoppingListHub_', '')] =
            tempProduct[prop];
      }
    }

    let shoppingListName = '';
    if (product.shoppingList.Id != null) {
      shoppingListName = product.shoppingList.Name;
    } else {
      shoppingListName = product['shoppingListHub']['AppHubName'];
    }
    if (shoppingListName == null) shoppingListName = '';
    delete product.shoppingList;
    delete product['shoppingListHub'];
    const shoppingList = new ShoppingList();
    shoppingList.Name = shoppingListName;
    this.eventBus.publish(
      new ProductToShoppingListsAddedEvent(
        { ...product, shoppingList },
        familyId,
        userId,
        fullName,
      ),
    );
  }
}
