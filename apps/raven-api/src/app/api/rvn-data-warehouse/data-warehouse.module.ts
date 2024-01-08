import { AccessToken } from '@azure/core-http';
import { DefaultAzureCredential } from '@azure/identity';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SqlServerConnectionCredentialsAuthenticationOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionCredentialsOptions';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { environment } from '../../../environments/environment';
@Module({})
export class DataWarehouseModule {
  public static async forRootAsync(): Promise<DynamicModule> {
    if (environment.features.dataWareHouse === false) {
      console.log('DataWarehouse connection stopped: feature disabled');
      return {
        module: DataWarehouseModule,
      };
    }
    const defaultCredential = new DefaultAzureCredential();
    let accessToken: AccessToken;
    defaultCredential
      .getToken('https://database.windows.net/')
      .then((token) => {
        accessToken = token;
      })
      .catch((err) => {
        console.log(err);
      });

    if (!accessToken) {
      console.log(
        'DataWarehouse module initialisation stopped: no access token',
      );
      return {
        module: DataWarehouseModule,
      };
    }
    const dataWarehouseConfig = environment.database.dataWarehouse;
    const alteredConfig = {
      ...dataWarehouseConfig,
      authentication: {
        type: 'azure-active-directory-access-token',
        options: {
          token: accessToken.token,
        },
      } as SqlServerConnectionCredentialsAuthenticationOptions,
    } as SqlServerConnectionOptions;

    const dataWarehouseDataSource = new DataSource(alteredConfig);

    let succeeded = false;
    await dataWarehouseDataSource
      .initialize()
      .then((dataSource) => {
        succeeded = true;
        console.log('DataWarehouse connection established');
      })
      .catch((err) => {
        succeeded = false;
        console.log(err);
        console.log(alteredConfig);
      });

    if (succeeded) {
      await dataWarehouseDataSource.destroy();
      return {
        module: DataWarehouseModule,
        imports: [TypeOrmModule.forRoot(alteredConfig)],
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
