export class OpportunityCreatedEvent {
  public constructor(
    public readonly opportunityEntityId: string,
    public readonly workflowTemplateId: string | null,
    public readonly createdById: string,
  ) {}
}
