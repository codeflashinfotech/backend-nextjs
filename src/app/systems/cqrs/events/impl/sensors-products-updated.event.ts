import { ISensorsProductsUpdatedEvent } from '../../cqrs.interface';

export class SensorsProductsUpdatedEvent {
  constructor(
    public productsUpdated: ISensorsProductsUpdatedEvent,
    public familyId: number,
  ) {}
}
