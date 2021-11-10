import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AddProductToCartCommand } from '../impl/add-product-to-cart.command';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../users/users.entity';
import { getManager, Repository } from 'typeorm';
import { ShoppingListProduct } from '../../../../systems/entities/shopping-list-products.entity';
import { ProductAddedToCartEvent } from '../../events/impl/product-added-to-cart.event';

@CommandHandler(AddProductToCartCommand)
export class AddProductToCartCommandHandler
  implements ICommandHandler<AddProductToCartCommand>
{
  constructor(
    private eventBus: EventBus,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute(command: AddProductToCartCommand): Promise<void> {
    const { vendors, familyId, userId, vendorProviderName } = command;
    const vendorsId = vendors.map((vendor) => vendor.upc);
    const user = await this.userRepository.findOne(userId);

    const products: Array<{ SLP_Name: string; SLP_VendorProductId: string }> =
      await getManager()
        .createQueryBuilder(ShoppingListProduct, 'SLP')
        .select(['SLP.Name', 'SLP.VendorProductId'])
        .groupBy('SLP.VendorProductId')
        .where('SLP.VendorProductId IN (:vendorsId)', { vendorsId })
        .getRawMany();

    const messages: Array<string> = products.map((product) => {
      const vendor = vendors.find(
        (value) => value.upc == product.SLP_VendorProductId,
      );
      return `${user.fullName} added ${vendor.quantity} ${product.SLP_Name} to ${vendorProviderName} cart`;
    });

    this.eventBus.publish(
      new ProductAddedToCartEvent(familyId, messages, userId),
    );
  }
}
