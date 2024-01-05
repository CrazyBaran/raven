import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { environment } from '../../../environments/environment';

@Module({})
export class DataWarehouseModule {
  public static async forRootAsync(): Promise<DynamicModule> {
    const dataWarehouseDataSource = new DataSource(
      environment.database.dataWarehouse,
    );

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
        console.log(environment.database.dataWarehouse);
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
