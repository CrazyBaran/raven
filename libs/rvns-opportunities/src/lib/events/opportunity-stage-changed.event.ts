import { CompanyStatus } from '../../../../rvns-shared/src';

export class OpportunityStageChangedEvent {
  public constructor(
    public readonly organisationName: string,
    public readonly organisationDomains: string[],
    public readonly targetPipelineMappedFrom: string,
    public readonly userId?: string,
    public readonly organisationId?: string,
    public readonly relatedCompanyStatus?: CompanyStatus,
  ) {}
}
