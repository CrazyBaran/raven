export class OpportunityStageChangedEvent {
  public constructor(
    public readonly organisationName: string,
    public readonly organisationDomains: string[],
    public readonly targetPipelineMappedFrom: string,
  ) {}
}
