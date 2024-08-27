import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SqlServerConnectionCredentialsAuthenticationOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { environment } from '../../../environments/environment';
import { BullService } from '../../core/bull.service';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { ShortlistsModule } from '../rvn-shortlists/shortlists.module';
import { DataWarehouseCacheService } from './cache/data-warehouse-cache.service';
import { DataWarehouseEnricher } from './cache/data-warehouse.enricher';
import { DWH_QUEUE, DataWarehouseDataSourceName } from './data-warehouse.const';
import { DataWarehouseController } from './data-warehouse.controller';
import { DataWarehouseService } from './data-warehouse.service';
import { DataWarehouseRegenerationOrganisationsFinishedEventHandler } from './event-handlers/data-warehouse-regeneration-organisations-finished.event-handler';
import { DataWarehouseAccessBase } from './interfaces/data-warehouse.access.base';
import { DataWarehouseRegenerator } from './proxy/data-warehouse.regenerator';
import { DataWarehouseCompaniesIndustryV1Entity } from './proxy/entities/data-warehouse-company-industries.v1.entity';
import { DataWarehouseCompaniesInvestorV1Entity } from './proxy/entities/data-warehouse-company-investors.v1.entity';
import { DataWarehouseCompanyV1Entity } from './proxy/entities/data-warehouse-company.v1.entity';
import { DataWarehouseOrderByMapper } from './proxy/order-by.mapper';
import { OrganisationProvider } from './proxy/organisation.provider';
import { DataWarehouseProcessor } from './queues/data-warehouse.processor';
import { DataWarehouseProducer } from './queues/data-warehouse.producer';
import { DataWarehouseScheduler } from './tasks/data-warehouse.scheduler';

import { FundManagerOrganisationEntity } from '../rvn-fund-managers/entities/fund-manager-organisation.entity';
import { FundManagerEntity } from '../rvn-fund-managers/entities/fund-manager.entity';
import {
  OrganisationTagEntity,
  TagEntity,
} from '../rvn-tags/entities/tag.entity';
import { DataWarehouseV2AccessService } from './v2/data-warehouse.v2.access.service';
import { CompanyV2DwhEntity } from './v2/entities/company.v2.dwh.entity';
import { ContactV2DwhEntity } from './v2/entities/contact.v2.dwh.entity';
import { EmployeesV2DwhEntity } from './v2/entities/employees.v2.dwh.entity';
import { FundingRoundV2DwhEntity } from './v2/entities/funding-round.v2.dwh.entity';
import { InvestmentV2DwhEntity } from './v2/entities/investment.v2.dwh.entity';
import { InvestorV2DwhEntity } from './v2/entities/investor.v2.dwh.entity';
import { NewsV2DwhEntity } from './v2/entities/news.v2.dwh.entity';
import { CompanyV2Mapper } from './v2/mappers/company.v2.mapper';
import { ContactV2Mapper } from './v2/mappers/contact.v2.mapper';
import { EmployeesV2Mapper } from './v2/mappers/employees.v2.mapper';
import { FundingRoundV2Mapper } from './v2/mappers/funding-round.v2.mapper';
import { NewsV2Mapper } from './v2/mappers/news.v2.mapper';
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
      case 'v2':
        module = this.buildV2Module(module);
        break;
      default: {
        console.log(
          'DataWarehouse connection stopped: version not found or not supported anymore',
        );
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
              backoff: { type: 'exponential', delay: 60000 },
            },
          },
        ]),
        TypeOrmModule.forFeature([
          DataWarehouseCompanyV1Entity,
          DataWarehouseCompaniesInvestorV1Entity,
          DataWarehouseCompaniesIndustryV1Entity,
          OrganisationEntity,
          TagEntity,
          OrganisationTagEntity,
          FundManagerEntity,
          FundManagerOrganisationEntity,
        ]),
        ShortlistsModule,
      ],
      controllers: [...module.controllers, DataWarehouseController],
      exports: [
        ...module.exports,
        DataWarehouseService,
        DataWarehouseCacheService,
        DataWarehouseEnricher,
        OrganisationProvider,
      ],
      providers: [
        ...module.providers,
        DataWarehouseService,
        DataWarehouseCacheService,
        DataWarehouseEnricher,
        DataWarehouseScheduler,
        DataWarehouseProducer,
        DataWarehouseProcessor,
        DataWarehouseRegenerator,
        OrganisationProvider,
        DataWarehouseOrderByMapper,
        DataWarehouseRegenerationOrganisationsFinishedEventHandler,
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
    const dataWarehouseConfigAuthenticationType =
      environment.dataWarehouse.authType;

    switch (dataWarehouseConfigAuthenticationType) {
      case 'azure-active-directory-default':
        return {
          ...dataWarehouseConfig,
          name: DataWarehouseDataSourceName,
          authentication: {
            type: 'azure-active-directory-default',
          } as SqlServerConnectionCredentialsAuthenticationOptions,
        } as SqlServerConnectionOptions;
      case 'default':
        return {
          ...dataWarehouseConfig,
          name: DataWarehouseDataSourceName,
          authentication: {
            type: 'default',
            options: environment.dataWarehouse.defaultAuth,
          } as SqlServerConnectionCredentialsAuthenticationOptions,
        } as SqlServerConnectionOptions;
      default:
        throw new Error(
          `DataWarehouse authentication type ${dataWarehouseConfigAuthenticationType} not supported`,
        );
    }
  }

  private static buildV2Module(module: DynamicModule): DynamicModule {
    return {
      ...module,
      imports: [
        ...module.imports,
        TypeOrmModule.forFeature(
          [
            CompanyV2DwhEntity,
            ContactV2DwhEntity,
            EmployeesV2DwhEntity,
            FundingRoundV2DwhEntity,
            NewsV2DwhEntity,
            InvestorV2DwhEntity,
            InvestmentV2DwhEntity,
          ],
          DataWarehouseDataSourceName,
        ),
        TypeOrmModule.forFeature([]),
      ],
      providers: [
        ...module.providers,
        {
          provide: DataWarehouseAccessBase,
          useClass: DataWarehouseV2AccessService,
        },
        DataWarehouseV2AccessService,
        CompanyV2Mapper,
        ContactV2Mapper,
        EmployeesV2Mapper,
        FundingRoundV2Mapper,
        NewsV2Mapper,
      ],
    };
  }
}
