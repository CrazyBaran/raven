import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SqlServerConnectionCredentialsAuthenticationOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { environment } from '../../../environments/environment';
import { DataWarehouseController } from './data-warehouse.controller';
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
        imports: [TypeOrmModule.forRoot(alteredConfig)],
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
