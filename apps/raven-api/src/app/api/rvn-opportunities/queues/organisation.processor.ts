import { AbstractSimpleQueueProcessor } from '@app/rvns-bull';
import { JobPro } from '@taskforcesh/bullmq-pro';
import { Processor } from '@taskforcesh/nestjs-bullmq-pro';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import {
  ORGANISATION_QUEUE,
  ORGANISATION_QUEUE__ENSURE_ALL_AFFINITY_ENTRIES_AS_ORGANISATIONS,
  ORGANISATION_QUEUE__ENSURE_ALL_DWH_ENTRIES_AS_ORGANISATIONS,
} from '../opportunities.const';
import { OpportunityService } from '../opportunity.service';
import { OrganisationService } from '../organisation.service';

export interface AffinityJobData<EncryptedType = Record<string, string>> {
  body: EncryptedType;
}

@Processor(ORGANISATION_QUEUE, {
  concurrency: 1,
  group: { concurrency: 1 },
  removeOnComplete: { age: 2592000 },
})
export class OrganisationProcessor extends AbstractSimpleQueueProcessor<AffinityJobData> {
  public constructor(
    private readonly organisationService: OrganisationService,
    private readonly opportunityService: OpportunityService,
    public readonly logger: RavenLogger,
  ) {
    super(logger);
    this.logger.setContext(OrganisationProcessor.name);
  }

  public async process(job: JobPro): Promise<boolean> {
    switch (job.name) {
      case ORGANISATION_QUEUE__ENSURE_ALL_AFFINITY_ENTRIES_AS_ORGANISATIONS: {
        await this.organisationService.ensureAllAffinityOrganisationsAsOrganisations(
          job,
        );
        await this.opportunityService.ensureAllAffinityEntriesAsOpportunities(
          job,
        );
        return true;
      }
      case ORGANISATION_QUEUE__ENSURE_ALL_DWH_ENTRIES_AS_ORGANISATIONS: {
        await this.organisationService.ensureAllDataWarehouseOrganisationsAsOrganisations(
          job,
        );
        return true;
      }
      default: {
        throw new Error(`Unknown job name: ${job.name}`);
      }
    }
  }
}
