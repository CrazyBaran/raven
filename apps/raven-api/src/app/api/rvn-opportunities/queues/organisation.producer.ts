import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from '@taskforcesh/bullmq-pro';
import {
  ORGANISATION_QUEUE,
  ORGANISATION_QUEUE__ENSURE_ALL_AFFINITY_ENTRIES_AS_ORGANISATIONS,
  ORGANISATION_QUEUE__ENSURE_ALL_DWH_ENTRIES_AS_ORGANISATIONS
} from '../opportunities.const';

@Injectable()
export class OrganisationProducer {
  public constructor(
    @InjectQueue(ORGANISATION_QUEUE) private readonly organisationQueue: Queue
  ) {
  }

  public async ensureAllAffinityEntriesAsOrganisations(): Promise<void> {
    await this.organisationQueue.add(
      ORGANISATION_QUEUE__ENSURE_ALL_AFFINITY_ENTRIES_AS_ORGANISATIONS,
      {}
    );
  }

  public async ensureAllDwhEntriesAsOrganisations(): Promise<void> {
    await this.organisationQueue.add(
      ORGANISATION_QUEUE__ENSURE_ALL_DWH_ENTRIES_AS_ORGANISATIONS,
      {}
    );
  }
}
