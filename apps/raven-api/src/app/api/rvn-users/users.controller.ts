import { Response } from 'express';

import {
  EmptyResponseData,
  UserData,
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from '@app/rvns-api';
import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';

import { AuthorizationService } from '../rvn-acl/authorization.service';
import { ShareAbility } from '../rvn-acl/casl/ability.factory';
import { ShareAction } from '../rvn-acl/enums/share-action.enum';
import { ShareResourceCode } from '../rvn-acl/enums/share-resource-code.enum';
import { CheckShare } from '../rvn-acl/permissions/share-policy.decorator';
import { TeamEntity } from '../rvn-teams/entities/team.entity';
import { ParseTeamPipe } from '../rvn-teams/pipes/parse-team.pipe';
import { Identity } from './decorators/identity.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { ProfileUpdateDto } from './dto/profile-update.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { ParseRoleByNamePipe } from './pipes/parse-role-by-name.pipe';
import { ParseUserPipe } from './pipes/parse-user.pipe';
import { UsersService } from './users.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  public constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthorizationService,
  ) {}

  @ApiOAuth2(['openid'])
  @ApiOperation({ description: 'List users' })
  @ApiResponse(GenericResponseSchema())
  @Get()
  @Roles(RoleEnum.SuperAdmin, RoleEnum.User)
  public async list(
    @Query() dto: ListUsersDto,
    @Identity() identity: UserData,
  ): Promise<UserData[]> {
    const entities = await this.usersService.list({
      search: dto.search,
      user: identity,
      userSameTeamOnly: !identity.roles.includes(RoleEnum.SuperAdmin),
    });
    return Promise.all(
      entities.map((user) => this.usersService.entityToResponseData(user)),
    );
  }

  @ApiOAuth2(['openid'])
  @ApiOperation({ description: 'Create user' })
  @ApiResponse(GenericCreateResponseSchema())
  @Post()
  @Roles(RoleEnum.SuperAdmin, RoleEnum.TeamAdmin)
  @CheckShare((ability: ShareAbility, context) =>
    ability.can(ShareAction.Edit, 't', context.body.teamId.toLowerCase()),
  )
  public async create(
    @Body() dto: CreateUserDto,
    @Body('teamId', ParseUUIDPipe, ParseTeamPipe)
    teamEntity: TeamEntity,
    @Body('role', ParseRoleByNamePipe)
    roleEntity: RoleEntity,
  ): Promise<UserData> {
    if ((await this.usersService.getByEmail(dto.email)) !== null) {
      throw new BadRequestException(
        'User with given e-mail address already exists',
      );
    }
    return this.usersService.entityToResponseData(
      await this.usersService.create(dto.email, {
        name: dto.name,
        role: roleEntity,
        team: teamEntity,
      }),
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Update user profile' })
  @ApiResponse(GenericResponseSchema())
  @Patch('profile')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.User)
  public async updateProfile(
    @Body() dto: ProfileUpdateDto,
    @Identity() identity: UserData,
  ): Promise<UserData> {
    const userEntity = await this.usersService.getByEmail(identity.email);
    return await this.usersService.entityToResponseData(
      await this.usersService.update(userEntity, { name: dto.name }),
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Update user' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse(GenericResponseSchema())
  @Patch(':id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.TeamAdmin)
  public async update(
    @Param('id', ParseUUIDPipe, ParseUserPipe)
    userEntity: UserEntity,
    @Body() dto: UpdateUserDto,
    @Identity() identity: UserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserData> {
    await this.authService.authorize(
      identity,
      ShareAction.Edit,
      `${ShareResourceCode.Team}-${
        (await this.usersService.getUserTeam(userEntity)).id
      }`,
    );
    res['endpointExtraLogs'] = userEntity.email;
    return this.usersService.entityToResponseData(
      await this.usersService.update(userEntity, {
        role: { enum: dto.role, identity },
      }),
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Unsuspend user' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse(GenericResponseSchema())
  @Post(':id/unsuspend')
  @HttpCode(200)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.TeamAdmin)
  public async unsuspend(
    @Param('id', ParseUUIDPipe, ParseUserPipe)
    userEntity: UserEntity,
    @Identity() identity: UserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmptyResponseData> {
    await this.authService.authorize(
      identity,
      ShareAction.Edit,
      `${ShareResourceCode.Team}-${
        (await this.usersService.getUserTeam(userEntity, true)).id
      }`,
    );
    await this.usersService.update(userEntity, { suspend: false });
    res['endpointExtraLogs'] = userEntity.email;
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Suspend user' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse(GenericResponseSchema())
  @Post(':id/suspend')
  @HttpCode(200)
  @Roles(RoleEnum.SuperAdmin, RoleEnum.TeamAdmin)
  public async suspend(
    @Param('id', ParseUUIDPipe, ParseUserPipe)
    userEntity: UserEntity,
    @Identity() identity: UserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmptyResponseData> {
    await this.authService.authorize(
      identity,
      ShareAction.Edit,
      `${ShareResourceCode.Team}-${
        (await this.usersService.getUserTeam(userEntity, true)).id
      }`,
    );
    await this.usersService.update(userEntity, { suspend: true });
    res['endpointExtraLogs'] = userEntity.email;
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Remove user' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse(GenericResponseSchema())
  @Delete(':id')
  @Roles(RoleEnum.SuperAdmin, RoleEnum.TeamAdmin)
  public async remove(
    @Param('id', ParseUUIDPipe, ParseUserPipe)
    userEntity: UserEntity,
    @Identity() identity: UserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmptyResponseData> {
    const team = await this.usersService.getUserTeam(userEntity);
    await this.authService.authorize(
      identity,
      ShareAction.Edit,
      `${ShareResourceCode.Team}-${team.id}`,
    );
    await this.usersService.remove(userEntity, team);
    res['endpointExtraLogs'] = userEntity.email;
  }
}
