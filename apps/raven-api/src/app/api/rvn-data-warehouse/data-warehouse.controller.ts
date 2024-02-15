import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import { DataWarehouseLastUpdatedDto } from '@app/shared/data-warehouse';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { DataWarehouseService } from './data-warehouse.service';
import { DataWarehouseProducer } from './queues/data-warehouse.producer';

@ApiTags('DataWarehouse')
@Controller('dwh')
export class DataWarehouseController {
  public constructor(
    private readonly logger: RavenLogger,
    private readonly dataWarehouseService: DataWarehouseService,
    private readonly dataWarehouseProducer: DataWarehouseProducer,
  ) {
    this.logger.setContext(DataWarehouseController.name);
  }

  @Get('force-cache-regeneration')
  @ApiOperation({
    summary:
      'Next time the Data Warehouse cache is scheduled to be regenerated, it will do so regardless of whether the last updated timestamp has changed.',
  })
  @ApiTags('DataWarehouse')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async regenerateCache(): Promise<void> {
    await this.dataWarehouseService.forceRegeneration();
  }

  @Get('regenerate-cache')
  @ApiOperation({
    summary:
      'Regenerate the Data Warehouse cache immediately. Warning: this is a very expensive operation and should only be used in emergencies. Use force-cache-regeneration instead.',
  })
  @ApiTags('DataWarehouse')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async regenerate(): Promise<void> {
    await this.dataWarehouseProducer.enqueueRegenerateDataWarehouse();
  }

  @Get('last-updated')
  @ApiOperation({
    summary: 'Get the last updated timestamp for the Data Warehouse cache.',
  })
  @ApiTags('DataWarehouse')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async lastUpdated(): Promise<DataWarehouseLastUpdatedDto> {
    return await this.dataWarehouseService.getLastUpdated();
  }

  @Get('industries')
  @ApiOperation({
    summary: 'Get all industries in the Data Warehouse.',
  })
  @ApiTags('DataWarehouse')
  @ApiOAuth2(['openid'])
  @ApiQuery({ name: 'query', required: false })
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async industries(@Query('query') query: string): Promise<string[]> {
    return await this.dataWarehouseService.getIndustries(query);
  }
}
