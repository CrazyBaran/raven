import { OpportunityEntity } from '../../../../../apps/raven-api/src/app/api/rvn-opportunities/entities/opportunity.entity';
import { TemplateEntity } from '../../../../../apps/raven-api/src/app/api/rvn-templates/entities/template.entity';
import { UserEntity } from '../../../../../apps/raven-api/src/app/api/rvn-users/entities/user.entity';

export class OpportunityCreatedEvent {
  public constructor(
    public readonly opportunityEntity: OpportunityEntity,
    public readonly workflowTemplate: TemplateEntity,
    public readonly createdBy: UserEntity,
  ) {}
}
