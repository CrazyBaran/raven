import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { environment } from '../../../../environments/environment';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { DataWarehouseService } from '../data-warehouse.service';
import { DataWarehouseProducer } from '../queues/data-warehouse.producer';

@Injectable()
export class DataWarehouseScheduler {
  public constructor(
    private readonly logger: RavenLogger,
    private readonly dataWarehouseProducer: DataWarehouseProducer,
    private readonly dataWarehouseService: DataWarehouseService,
  ) {
    this.logger.setContext(DataWarehouseScheduler.name);
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM, {
    name: 'dataWarehouseRegeneration',
    disabled: !environment.features.dataWareHouse,
  })
  public async regenerateDataWarehouse(): Promise<void> {
    this.logger.log('Checking whether to regenerate the Data Warehouse cache');

    const dataWarehouseChanged =
      await this.dataWarehouseService.dataWarehouseChanged();
    this.logger.log(
      dataWarehouseChanged
        ? 'Data Warehouse changes detected'
        : 'No Data Warehouse changes detected',
    );

    const forcedRegeneration =
      await this.dataWarehouseService.regenerationForced();
    this.logger.log(
      forcedRegeneration
        ? 'Data Warehouse cache regeneration forced'
        : 'Data Warehouse cache regeneration not forced',
    );

    if (dataWarehouseChanged || forcedRegeneration) {
      this.logger.log('Enqueuing Data Warehouse cache regeneration');
      await this.dataWarehouseProducer.enqueueRegenerateDataWarehouse();
      await this.dataWarehouseService.clearForceRegeneration();
    }
  }
}
