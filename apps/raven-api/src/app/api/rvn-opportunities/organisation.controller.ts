import { OrganisationData } from '@app/rvns-opportunities';
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
} from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOperation,
  ApiParam,
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
  @ApiResponse({ status: 200, description: 'List of organisations' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public async findAll(): Promise<OrganisationData[]> {
    return await this.organisationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single organisation' })
  @ApiResponse({ status: 200, description: 'The organisation details' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public async findOne(@Param('id') id: string): Promise<OrganisationEntity> {
    return await this.organisationService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organisation' })
  @ApiResponse({
    status: 201,
    description: 'The organisation has been successfully created.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
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
  @Roles(RoleEnum.User)
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
  @Roles(RoleEnum.User)
  public async remove(
    @Param('id', ParseUUIDPipe, ParseOrganisationPipe)
    organisation: OrganisationEntity,
  ): Promise<void> {
    return await this.organisationService.remove(organisation.id);
  }
}
