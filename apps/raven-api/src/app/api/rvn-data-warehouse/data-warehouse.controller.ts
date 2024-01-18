import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { DataWarehouseService } from './data-warehouse.service';
import { CompanyEntity } from './entities/company.entity';

export class DwhCompanyDto {}

export class DwhCountDto {
  public count: number;
}
@ApiTags('DataWarehouse')
@Controller('dwh')
export class DataWarehouseController {
  public constructor(
    @InjectEntityManager('dataWarehouse')
    private readonly entityManager: EntityManager,
    private readonly logger: RavenLogger,
    private readonly dataWarehouseService: DataWarehouseService,
  ) {
    this.logger.setContext(DataWarehouseController.name);
  }

  @Get('companies')
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ status: 200, description: 'The companies list' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async getCompanies(): Promise<CompanyEntity[]> {
    const response = await this.dataWarehouseService.getCompanies();
    return response;
  }

  @Get('companies/:domain')
  @ApiOperation({ summary: 'Get a single company by domain' })
  @ApiResponse({ status: 200, description: 'The company details' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async getCompany(
    @Param('domain') domain: string,
  ): Promise<DwhCompanyDto> {
    const query = await this.entityManager.query<DwhCountDto>(
      `SELECT count(*) as Count FROM [Raven].[Companies]`,
    );
    return query;
  }
}
