export class OpportunityStageChangedEvent {
  public constructor(
    public readonly organisationDomains: string[],
    public readonly targetPipelineMappedFrom: string,
  ) {}
}
