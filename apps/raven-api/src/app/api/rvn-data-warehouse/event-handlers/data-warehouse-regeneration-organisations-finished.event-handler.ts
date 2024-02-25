import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import { DataWarehouseProducer } from '../queues/data-warehouse.producer';

@Injectable()
export class DataWarehouseRegenerationOrganisationsFinishedEventHandler {
  public constructor(
    private readonly logger: RavenLogger,
    private readonly dataWarehouseProducer: DataWarehouseProducer,
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
  ) {
    this.logger.setContext(
      DataWarehouseRegenerationOrganisationsFinishedEventHandler.name,
    );
  }

  @OnEvent('data-warehouse.regeneration.organisations.finished')
  protected async process(): Promise<void> {
    await this.dataWarehouseProducer.enqueueClearProxy();

    const chunkSize = 10000;
    const organisations = await this.organisationRepository.count();

    for (let i = 0; i < organisations; i += chunkSize) {
      this.logger.log(
        `Regenerating organisations: ${i} to ${
          i + chunkSize
        } (percent: ${Math.floor((i / organisations) * 100)})`,
      );

      await this.dataWarehouseProducer.enqueueRegenerateProxy(i, chunkSize);
    }
  }
}
