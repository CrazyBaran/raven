import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { environment } from '../../../../environments/environment';
import { RavenLogger } from '../../rvn-logger/raven.logger';
import { DataWarehouseService } from '../data-warehouse.service';
import { DataWarehouseProducer } from '../queues/data-warehouse.producer';

@Injectable()
export class DataWarehouseScheduler {
  private readonly RETRIES = 4;
  public constructor(
    private readonly logger: RavenLogger,
    private readonly dataWarehouseProducer: DataWarehouseProducer,
    private readonly dataWarehouseService: DataWarehouseService,
  ) {
    this.logger.setContext(DataWarehouseScheduler.name);
  }

  @Cron('45 03 * * *', {
    name: 'dataWarehouseRegeneration',
    disabled: !environment.features.dataWareHouse,
  })
  public async regenerateDataWarehouse(): Promise<void> {
    this.logger.log('Checking whether to regenerate the Data Warehouse cache');
    let attempt = 1;
    let dataWarehouseChanged = false;
    for (let i = 0; i < this.RETRIES; i++) {
      try {
        dataWarehouseChanged =
          await this.dataWarehouseService.dataWarehouseChanged();
      } catch (e) {
        this.logger.log(`Error in attempt ${attempt}. MESSAGE: ${e?.message}`);
        attempt++;
        if (attempt > this.RETRIES) {
          throw e;
        }
      }
    }

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

    await this.dataWarehouseService.updateLastChecked();
  }
}
