export class HubCreatedEvent {
  constructor(
    public readonly HubAppId: string,
    public readonly HubName: string,
    public readonly FamilyId: number,
    public readonly UserId: number,
  ) {}
}
