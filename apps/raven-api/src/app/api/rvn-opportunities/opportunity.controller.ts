import { OpportunityData } from '@app/rvns-opportunities';
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
import { OpportunityEntity } from './entities/opportunity.entity';
import { OpportunityService } from './opportunity.service';

@ApiTags('Opportunities')
@Controller('opportunities')
export class OpportunityController {
  public constructor(private readonly opportunityService: OpportunityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all opportunities' })
  @ApiResponse({ status: 200, description: 'List of opportunities' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public async findAll(): Promise<OpportunityData[]> {
    return await this.opportunityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single opportunity' })
  @ApiResponse({ status: 200, description: 'The opportunity details' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public findOne(@Param('id') id: string): Promise<OpportunityEntity> {
    return this.opportunityService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new opportunity' })
  @ApiResponse({
    status: 201,
    description: 'The opportunity has been successfully created.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public create(
    @Body() opportunity: OpportunityEntity,
  ): Promise<OpportunityEntity> {
    return this.opportunityService.create(opportunity);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an opportunity' })
  @ApiResponse({
    status: 200,
    description: 'The opportunity has been successfully updated.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public update(
    @Param('id') id: string,
    @Body() opportunity: OpportunityEntity,
  ): Promise<void> {
    return this.opportunityService.update(id, opportunity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an opportunity' })
  @ApiResponse({
    status: 200,
    description: 'The opportunity has been successfully deleted.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User)
  public remove(@Param('id') id: string): Promise<void> {
    return this.opportunityService.remove(id);
  }
}
