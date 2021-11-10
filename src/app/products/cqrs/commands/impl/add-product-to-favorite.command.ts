export class AddProductToFavoriteCommand {
  constructor(
    public readonly foodId: number,
    public readonly userId: number,
    public readonly familyId: number,
  ) {}
}
