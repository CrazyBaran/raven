import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrganisationData } from '../../../../../../libs/rvns-opportunities/src/lib/data/organisation-data.interface';
import { OrganisationEntity } from './entities/organisation.entity';
import { OrganisationService } from './organisation.service';

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
  public findAll(): Promise<OrganisationData[]> {
    return this.organisationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single organisation' })
  @ApiResponse({ status: 200, description: 'The organisation details' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public findOne(@Param('id') id: string): Promise<OrganisationEntity> {
    return this.organisationService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organisation' })
  @ApiResponse({
    status: 201,
    description: 'The organisation has been successfully created.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public create(
    @Body() organisation: OrganisationEntity,
  ): Promise<OrganisationEntity> {
    return this.organisationService.create(organisation);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an organisation' })
  @ApiResponse({
    status: 200,
    description: 'The organisation has been successfully updated.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public update(
    @Param('id') id: string,
    @Body() organisation: OrganisationEntity,
  ): Promise<void> {
    return this.organisationService.update(id, organisation);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organisation' })
  @ApiResponse({
    status: 200,
    description: 'The organisation has been successfully deleted.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public remove(@Param('id') id: string): Promise<void> {
    return this.organisationService.remove(id);
  }
}
