export class OpportunityCreatedEvent {
  public constructor(
    public readonly opportunityEntityId: string,
    public readonly workflowTemplateId: string,
    public readonly createdById: string,
  ) {}
}
