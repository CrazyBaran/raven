export class AffinityStatusChangedEvent {
  public constructor(
    public readonly organisationDomains: string[],
    public readonly targetStatusName: string,
  ) {}
}
