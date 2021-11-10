import { AddVendorsToCartDto } from '../../../dto';

export class AddProductToCartCommand {
  constructor(
    public readonly vendors: AddVendorsToCartDto[],
    public readonly familyId: number,
    public readonly userId: number,
    public readonly vendorProviderName: string,
  ) {}
}
