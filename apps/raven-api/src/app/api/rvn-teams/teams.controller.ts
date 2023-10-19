import {
  EmptyResponseData,
  GenericCreateResponseSchema,
  GenericResponseSchema,
  UserData,
} from '@app/rvns-api';
import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import { TeamData, TeamsData } from '@app/rvns-teams';

import {
  BadRequestException,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { CreateTeamDto } from './dto/create-team.dto';
import { ListTeamsDto } from './dto/list-teams.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamEntity } from './entities/team.entity';
import { ParseTeamPipe } from './pipes/parse-team.pipe';
import { TeamsService } from './teams.service';

import { Scopes } from '../rvn-auth/scopes';

@ApiOAuth2([Scopes.apiAccess()])
@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  public constructor(private readonly teamsService: TeamsService) {}

  @ApiOperation({ description: 'List teams' })
  @ApiResponse(GenericResponseSchema())
  @Get()
  @Roles(RoleEnum.SuperAdmin)
  public async list(
    @Query() dto: ListTeamsDto,
    @Identity() user: UserData,
  ): Promise<TeamsData> {
    return this.teamsService.list(user, {
      skip: dto.skip,
      take: dto.take,
      sort: dto.sort,
      sortDir: dto.sortDir,
    });
  }

  @ApiOperation({ description: 'Load team' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse(GenericResponseSchema())
  @Get(':id')
  @Roles(RoleEnum.SuperAdmin)
  public async single(
    @Param('id', ParseUUIDPipe, ParseTeamPipe)
    teamEntity: TeamEntity,
  ): Promise<TeamData> {
    return this.teamsService.entityToResponseData(teamEntity);
  }

  @ApiOperation({ description: 'Create team' })
  @ApiResponse(GenericCreateResponseSchema())
  @Post()
  @Roles(RoleEnum.SuperAdmin)
  public async create(@Body() dto: CreateTeamDto): Promise<TeamData> {
    try {
      return this.teamsService.entityToResponseData(
        await this.teamsService.create(dto.name),
      );
    } catch (e) {
      if (e.message) {
        if (e.message.includes('already exists')) {
          throw new BadRequestException(e.message);
        }
        if (e.message.includes('Multiple teams per user')) {
          throw new BadRequestException(e.message);
        }
      }
      throw e;
    }
  }

  @ApiOperation({ description: 'Update team' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse(GenericResponseSchema())
  @Patch(':id')
  @Roles(RoleEnum.SuperAdmin)
  public async update(
    @Param('id', ParseUUIDPipe, ParseTeamPipe)
    teamEntity: TeamEntity,
    @Body() dto: UpdateTeamDto,
  ): Promise<TeamData> {
    return this.teamsService.entityToResponseData(
      await this.teamsService.update(teamEntity, dto),
    );
  }

  @ApiOperation({ description: 'Remove team' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse(GenericResponseSchema())
  @Delete(':id')
  @Roles(RoleEnum.SuperAdmin)
  public async remove(
    @Param('id', ParseUUIDPipe, ParseTeamPipe)
    teamEntity: TeamEntity,
  ): Promise<EmptyResponseData> {
    await this.teamsService.remove(teamEntity);
  }
}
