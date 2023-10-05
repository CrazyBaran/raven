import { GenericResponseSchema, UserData } from '@app/rvns-api';
import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';

import { Controller, Get, Query } from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Identity } from './decorators/identity.decorator';
import { ListUsersDto } from './dto/list-users.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

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
      userSameTeamOnly: false,
    });
    return Promise.all(
      entities.map((user) => this.usersService.entityToResponseData(user)),
    );
  }
}
