import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from '@taskforcesh/bullmq-pro';
import { Repository } from 'typeorm';
import { environment } from '../../../../environments/environment';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { OrganisationEntity } from '../../rvn-opportunities/entities/organisation.entity';
import { DWH_QUEUE } from '../data-warehouse.const';
import { DataWarehouseProducer } from '../queues/data-warehouse.producer';

@Injectable()
export class DataWarehouseRegenerationOrganisationsFinishedEventHandler {
  public constructor(
    private readonly logger: RavenLogger,
    private readonly dataWarehouseProducer: DataWarehouseProducer,
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    @InjectQueue(DWH_QUEUE.NAME) private readonly queue: Queue,
  ) {
    this.logger.setContext(
      DataWarehouseRegenerationOrganisationsFinishedEventHandler.name,
    );
  }

  @OnEvent('data-warehouse.regeneration.organisations.finished')
  protected async process(): Promise<void> {
    if (!environment.dataWarehouse.enableProxyRegeneration) {
      return;
    }
    const chunkSize = 10000;
    const organisations = await this.organisationRepository.count();

    await this.queue.clean(0, 1000, 'wait');

    for (let i = 0; i < organisations; i += chunkSize) {
      await this.dataWarehouseProducer.enqueueRegenerateProxy(i, chunkSize);
    }
  }
}
