export class RemoveShoppingListCommand {
  constructor(
    public readonly shoppingListName: string,
    public readonly familyId: number,
    public readonly userId: number,
    public readonly fullName: string,
  ) {}
}
