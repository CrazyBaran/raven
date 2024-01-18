import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SqlServerConnectionCredentialsAuthenticationOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { environment } from '../../../environments/environment';
import { DataWarehouseController } from './data-warehouse.controller';
import { DataWarehouseService } from './data-warehouse.service';
import { CompanyEntity } from './entities/company.entity';
import { DealroomCompanyNumberOfEmployeesEntity } from './entities/dealroom-company-number-of-employees.entity';
import { DealroomCompanyTagEntity } from './entities/dealroom-company-tags.entity';
import { DealroomFundingRoundEntity } from './entities/dealroom-funding-rounds.entity';
import { FounderEntity } from './entities/founder.entity';
import { InvestorEntity } from './entities/investor.entity';
@Module({})
export class DataWarehouseModule {
  public static async forRootAsync(): Promise<DynamicModule> {
    if (environment.features.dataWareHouse === false) {
      console.log('DataWarehouse connection stopped: feature disabled');
      return {
        module: DataWarehouseModule,
      };
    }
    /*
    const defaultCredential = new DefaultAzureCredential();
    let accessToken: AccessToken;
    try {
      accessToken = await defaultCredential.getToken(
        'https://database.windows.net/',
      );
    } catch (err) {
      console.log(err);
    }
    if (!accessToken) {
      console.log(
        'DataWarehouse module initialisation stopped: no access token',
      );
      return {
        module: DataWarehouseModule,
      };
    }

     */
    const dataWarehouseConfig = environment.database.dataWarehouse;
    const alteredConfig = {
      ...dataWarehouseConfig,
      name: 'dataWarehouse',
      authentication: {
        type: 'azure-active-directory-default',
      } as SqlServerConnectionCredentialsAuthenticationOptions,
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
    } as SqlServerConnectionOptions;

    const dataWarehouseDataSource = new DataSource(alteredConfig);

    let succeeded = false;
    try {
      await dataWarehouseDataSource.initialize();
      succeeded = true;
    } catch (err) {
      console.log(err);
      succeeded = false;
    }

    if (succeeded) {
      console.log('DataWarehouse module initialised');
      await dataWarehouseDataSource.destroy();
      return {
        module: DataWarehouseModule,
        imports: [
          TypeOrmModule.forRoot(alteredConfig),
          TypeOrmModule.forFeature(
            [
              CompanyEntity,
              DealroomCompanyNumberOfEmployeesEntity,
              DealroomCompanyTagEntity,
              DealroomFundingRoundEntity,
              FounderEntity,
              InvestorEntity,
            ],
            'dataWarehouse',
          ),
        ],
        providers: [DataWarehouseService],
        controllers: [DataWarehouseController],
      };
    } else {
      console.log(
        'DataWarehouse module initialisation stopped: connection failed',
      );
      return {
        module: DataWarehouseModule,
      };
    }
  }
}
