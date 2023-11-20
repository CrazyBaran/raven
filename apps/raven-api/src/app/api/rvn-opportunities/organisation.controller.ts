import {
  OrganisationData,
  OrganisationDataWithOpportunities,
  PagedOrganisationData,
} from '@app/rvns-opportunities';
import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
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
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { OrganisationEntity } from './entities/organisation.entity';
import { OrganisationService } from './organisation.service';
import { ParseOrganisationPipe } from './pipes/parse-organisation.pipe';

@ApiTags('Organisations')
@Controller('organisations')
export class OrganisationController {
  public constructor(
    public readonly organisationService: OrganisationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all organisations' })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'dir', type: String, required: false })
  @ApiQuery({ name: 'field', type: String, required: false })
  @ApiQuery({ name: 'query', type: String, required: false })
  @ApiResponse({ status: 200, description: 'List of organisations' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('dir') dir?: 'asc' | 'desc',
    @Query('field') field?: 'name' | 'id',
    @Query('query') query?: string,
  ): Promise<PagedOrganisationData> {
    const options = {
      skip: skip ?? 0,
      take: take ?? 10,
      dir: (dir ?? 'asc').toUpperCase() as 'ASC' | 'DESC',
      field: field ?? 'name',
      query: query ?? '',
    };

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
  ): Promise<OrganisationData> {
    return this.organisationService.organisationEntityToData(
      await this.organisationService.update(organisation, dto),
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
}
