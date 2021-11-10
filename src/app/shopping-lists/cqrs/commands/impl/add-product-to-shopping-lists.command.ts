export class AddProductToShoppingListsCommand {
  constructor(
    public readonly productId: number,
    public readonly userId: number,
    public readonly familyId: number,
    public readonly fullName: string,
  ) {}
}
