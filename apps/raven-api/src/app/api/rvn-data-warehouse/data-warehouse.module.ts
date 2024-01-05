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
      return {
        module: DataWarehouseModule,
      };
    }

    const dataWarehouseConfig = environment.database.dataWarehouse;
    const alteredConfig = {
      ...dataWarehouseConfig,
      authentication: {
        type: 'azure-active-directory-default',
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
        imports: [TypeOrmModule.forRoot(environment.database.dataWarehouse)],
      };
    } else {
      return {
        module: DataWarehouseModule,
      };
    }
  }
}
