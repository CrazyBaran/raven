export class AffinityOrganizationCreatedEvent {
  public constructor(
    public readonly name: string,
    public readonly domains: string[],
  ) {}
}
