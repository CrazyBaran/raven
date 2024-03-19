import {
  OrganisationData,
  OrganisationDataWithOpportunities,
  PagedOrganisationData,
} from '@app/rvns-opportunities';
import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import {
  ContactDto,
  FundingRoundDto,
  NewsDto,
  NumberOfEmployeesSnapshotDto,
} from '@app/shared/data-warehouse';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PagedData } from 'rvns-shared';
import { ParseUserFromIdentityPipe } from '../../shared/pipes/parse-user-from-identity.pipe';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { OrganisationEntity } from './entities/organisation.entity';
import { OrganisationService } from './organisation.service';
import { ParseGetOrganisationsOptionsPipe } from './pipes/parse-get-organisations-options.pipe';
import { ParseOrganisationPipe } from './pipes/parse-organisation.pipe';
import { OrganisationProducer } from './queues/organisation.producer';

@ApiTags('Organisations')
@Controller('organisations')
export class OrganisationController {
  public constructor(
    public readonly organisationService: OrganisationService,
    public readonly organisationProducer: OrganisationProducer,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all organisations' })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'dir', type: String, required: false })
  @ApiQuery({ name: 'field', type: String, required: false })
  @ApiQuery({ name: 'query', type: String, required: false })
  @ApiQuery({ name: 'member', type: String, required: false })
  @ApiQuery({ name: 'round', type: String, required: false })
  @ApiQuery({ name: 'shortlistId', type: String, required: false })
  @ApiQuery({ name: 'domain', type: String, required: false })
  @ApiQuery({
    name: 'filters',
    type: String,
    required: false,
    allowReserved: true,
  })
  @ApiQuery({ name: 'status', type: String, required: false })
  @ApiResponse({ status: 200, description: 'List of organisations' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findAll(
    // Workaround for a NestJS bug. 'options' is actually of type GetOrganisationsOptions, but it has to be set as Record<string, string> to make it properly transform in a pipe.
    @Query(ParseGetOrganisationsOptionsPipe) options?: Record<string, string>,
    @Query('domain') domain?: string,
  ): Promise<PagedOrganisationData> {
    if (domain) {
      const organisations = await this.organisationService.findByDomain(domain);
      return {
        items: organisations.map((organisation) => {
          return {
            ...this.organisationService.organisationEntityToData(organisation),
            opportunities: undefined,
          };
        }),
        total: organisations.length,
      };
    }
    return await this.organisationService.findAll(options);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single organisation' })
  @ApiResponse({ status: 200, description: 'The organisation details' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findOne(
    @Param('id') id: string,
  ): Promise<OrganisationDataWithOpportunities> {
    return await this.organisationService.findOne(id);
  }

  @Get(':id/news')
  @ApiOperation({ summary: 'Get news for a single organisation' })
  @ApiResponse({ status: 200, description: 'The organisation news' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findNews(
    @Param('id') id: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PagedData<Partial<NewsDto>>> {
    return await this.organisationService.findNews(id, skip, take);
  }

  @Get(':id/funding-rounds')
  @ApiOperation({ summary: 'Get funding rounds for a single organisation' })
  @ApiResponse({ status: 200, description: 'The organisation funding rounds' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findFundingRounds(
    @Param('id') id: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PagedData<Partial<FundingRoundDto>>> {
    return await this.organisationService.findFundingRounds(id, skip, take);
  }

  @Get(':id/employees')
  @ApiOperation({ summary: 'Get employees for a single organisation' })
  @ApiResponse({ status: 200, description: 'The organisation employees' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findEmployees(
    @Param('id') id: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PagedData<Partial<NumberOfEmployeesSnapshotDto>>> {
    return await this.organisationService.findEmployees(id, skip, take);
  }

  @Get(':id/contacts')
  @ApiOperation({ summary: 'Get contacts for a single organisation' })
  @ApiResponse({ status: 200, description: 'The organisation contacts' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findContacts(
    @Param('id') id: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PagedData<Partial<ContactDto>>> {
    return await this.organisationService.findContacts(id, skip, take);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organisation' })
  @ApiResponse({
    status: 201,
    description: 'The organisation has been successfully created.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async create(
    @Body() dto: CreateOrganisationDto,
  ): Promise<OrganisationData> {
    return this.organisationService.organisationEntityToData(
      await this.organisationService.create({
        name: dto.name,
        domain: dto.domain,
        initialDataSource: 'raven',
      }),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organisation' })
  @ApiResponse({
    status: 200,
    description: 'The organisation has been successfully updated.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async update(
    @Param('id', ParseUUIDPipe, ParseOrganisationPipe)
    organisation: OrganisationEntity,
    @Body() dto: UpdateOrganisationDto,
    @Identity(ParseUserFromIdentityPipe)
    user: UserEntity,
  ): Promise<OrganisationData> {
    return this.organisationService.organisationEntityToData(
      await this.organisationService.update(organisation, dto, user),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organisation' })
  @ApiResponse({
    status: 200,
    description: 'The organisation has been successfully deleted.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async remove(
    @Param('id', ParseUUIDPipe, ParseOrganisationPipe)
    organisation: OrganisationEntity,
  ): Promise<void> {
    return await this.organisationService.remove(organisation.id);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete organisations' })
  @ApiResponse({
    status: 200,
    description: 'The organisations have been successfully deleted.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async removeMany(@Body() ids: string[]): Promise<void> {
    return await this.organisationService.removeMany(ids);
  }

  @Get('sync/dwh')
  @ApiOperation({
    summary:
      'Queue a job to ensure that all organisations in the Data Warehouse are also in the Raven database.',
  })
  @ApiTags('DataWarehouse')
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async syncDwh(): Promise<void> {
    await this.organisationProducer.ensureAllDwhEntriesAsOrganisations();
  }
}
