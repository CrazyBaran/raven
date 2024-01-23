import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrganisationProducer } from '../queues/organisation.producer';

@Injectable()
export class DataWarehouseRegenerationFinishedEventHandler {
  public constructor(
    private readonly organisationProducer: OrganisationProducer,
  ) {}

  @OnEvent('data-warehouse.regeneration.finished')
  protected async process(): Promise<void> {
    await this.organisationProducer.ensureAllDwhEntriesAsOrganisations();
  }
}
