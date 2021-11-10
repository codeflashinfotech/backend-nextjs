export class ProductAddedToCartEvent {
  constructor(
    public readonly familyId: number,
    public readonly messages: Array<string>,
    public readonly userId: number,
  ) {}
}
