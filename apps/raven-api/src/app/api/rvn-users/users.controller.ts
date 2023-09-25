import { UserData, GenericResponseSchema } from '@app/rvns-api';
import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';

import { AuthorizationService } from '../rvn-acl/authorization.service';
import { Identity } from './decorators/identity.decorator';
import { ListUsersDto } from './dto/list-users.dto';
import { UsersService } from './users.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
}
