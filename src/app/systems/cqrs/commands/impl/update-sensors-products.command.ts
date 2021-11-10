export class UpdateSensorsProductsCommand {
  constructor(
    public readonly hubId: number,
    public readonly appHubName: string,
    public readonly familyId: number,
  ) {}
}
