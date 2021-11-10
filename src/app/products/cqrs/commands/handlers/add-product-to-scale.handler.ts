import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ProductToScaleAddedEvent } from '../../events/impl/product-to-scale-added.event';
import { AddProductToScaleCommand } from '../impl/add-product-to-scale.command';

@CommandHandler(AddProductToScaleCommand)
export class AddProductToScaleCommandHandler
  implements ICommandHandler<AddProductToScaleCommand>
{
  constructor(private eventBus: EventBus) {}
  async execute(command: AddProductToScaleCommand) {
    const { product, userId, familyId } = command;
    this.eventBus.publish(
      new ProductToScaleAddedEvent(product, familyId, userId),
    );
  }
}
