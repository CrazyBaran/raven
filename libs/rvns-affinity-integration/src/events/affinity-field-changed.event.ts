export class AffinityFieldChangedEvent {
  public constructor(
    public readonly organisationDomains: string[],
    public readonly fields: { displayName: string; value: unknown }[],
  ) {}
}
