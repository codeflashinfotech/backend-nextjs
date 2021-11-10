export class CreateHubCommand {
  constructor(
    public readonly hubAppId: string,
    public readonly appHubName: string,
    public readonly userId: number,
    public readonly familyId: number,
  ) {}
}
