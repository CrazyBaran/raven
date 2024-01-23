import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SqlServerConnectionCredentialsAuthenticationOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { environment } from '../../../environments/environment';
import { BullService } from '../../core/bull.service';
import { DataWarehouseCacheService } from './cache/data-warehouse-cache.service';
import { DataWarehouseEnricher } from './cache/data-warehouse.enricher';
import {
  DWH_QUEUE,
  DWH_SERVICE,
  DataWarehouseDataSourceName,
} from './data-warehouse.const';
import { DataWarehouseController } from './data-warehouse.controller';
import { DataWarehouseService } from './data-warehouse.service';
import { DataWarehouseProcessor } from './queues/data-warehouse.processor';
import { DataWarehouseProducer } from './queues/data-warehouse.producer';
import { DataWarehouseScheduler } from './tasks/data-warehouse.scheduler';
import { DataWarehouseAccessService } from './v1/data-warehouse.access.service';
import { CompanyEntity } from './v1/entities/company.entity';
import { DealroomCompanyNumberOfEmployeesEntity } from './v1/entities/dealroom-company-number-of-employees.entity';
import { DealroomCompanyTagEntity } from './v1/entities/dealroom-company-tags.entity';
import { DealroomFundingRoundEntity } from './v1/entities/dealroom-funding-rounds.entity';
import { FounderEntity } from './v1/entities/founder.entity';
import { InvestorEntity } from './v1/entities/investor.entity';
import { CompanyMapper } from './v1/mappers/company.mapper';
import { FounderMapper } from './v1/mappers/founder.mapper';
import { FundingRoundMapper } from './v1/mappers/funding-round.mapper';
import { InvestorMapper } from './v1/mappers/investor.mapper';
import { NumberOfEmployeesMapper } from './v1/mappers/number-of-employees.mapper';
import { DataWarehouseOrderByMapper } from './v1/mappers/order-by.mapper';
@Module({})
export class DataWarehouseModule {
  public static async forRootAsync(): Promise<DynamicModule> {
    let module: DynamicModule = {
      imports: [],
      controllers: [],
      providers: [],
      exports: [],
      module: DataWarehouseModule,
    };

    if (environment.features.dataWareHouse === false) {
      console.log('DataWarehouse connection stopped: feature disabled');
      return module;
    }

    const config = await this.buildConfig();
    const connectionSuccessful =
      await DataWarehouseModule.testConnection(config);

    if (!connectionSuccessful) {
      console.log('DataWarehouse connection stopped: connection failed');
      return module;
    }

    module = {
      ...module,
      imports: [...module.imports, TypeOrmModule.forRoot(config)],
    };

    switch (environment.dataWarehouse.version) {
      case 'v1':
        module = this.buildV1Module(module);
        break;
      default: {
        console.log('DataWarehouse connection stopped: version not found');
        return module;
      }
    }

    module = {
      ...module,
      imports: [
        ...module.imports,
        BullService.registerQueue([
          {
            name: DWH_QUEUE.NAME,
            order: 0,
            description: 'Communicate with Data Warehouse',
            defaultJobOptions: {
              attempts: 3,
              // exponential fn: 2 ^ ($attempts - 1) * $delay
              backoff: { type: 'exponential', delay: 60000 },
            },
          },
        ]),
      ],
      controllers: [...module.controllers, DataWarehouseController],
      exports: [
        ...module.exports,
        DataWarehouseService,
        DataWarehouseCacheService,
        DataWarehouseEnricher,
      ],
      providers: [
        ...module.providers,
        DataWarehouseService,
        DataWarehouseCacheService,
        DataWarehouseEnricher,
        DataWarehouseScheduler,
        DataWarehouseProducer,
        DataWarehouseProcessor,
      ],
    };

    return module;
  }

  private static async testConnection(
    options: DataSourceOptions,
  ): Promise<boolean> {
    const dataWarehouseDataSource = new DataSource(options);

    let succeeded = false;
    try {
      await dataWarehouseDataSource.initialize();
      succeeded = true;
    } catch (err) {
      console.log(err);
      succeeded = false;
    }

    if (succeeded) {
      await dataWarehouseDataSource.destroy();
    }

    return succeeded;
  }

  private static async buildConfig(): Promise<DataSourceOptions> {
    const dataWarehouseConfig = environment.dataWarehouse.database;
    const alteredConfig = {
      ...dataWarehouseConfig,
      name: DataWarehouseDataSourceName,
      authentication: {
        type: 'azure-active-directory-default',
      } as SqlServerConnectionCredentialsAuthenticationOptions,
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
    } as SqlServerConnectionOptions;

    return alteredConfig;
  }

  private static buildV1Module(module: DynamicModule): DynamicModule {
    return {
      ...module,
      imports: [
        ...module.imports,
        TypeOrmModule.forFeature(
          [
            CompanyEntity,
            DealroomCompanyNumberOfEmployeesEntity,
            DealroomCompanyTagEntity,
            DealroomFundingRoundEntity,
            FounderEntity,
            InvestorEntity,
          ],
          DataWarehouseDataSourceName,
        ),
      ],
      providers: [
        ...module.providers,
        { provide: DWH_SERVICE, useClass: DataWarehouseAccessService },
        CompanyMapper,
        DataWarehouseOrderByMapper,
        NumberOfEmployeesMapper,
        FundingRoundMapper,
        FounderMapper,
        InvestorMapper,
      ],
    };
  }
}
