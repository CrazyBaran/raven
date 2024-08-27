import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { FundManagerRelationStrength } from 'rvns-shared';
import { ParseTagsPipe } from '../../shared/pipes/parse-tags.pipe';
import { ParseUserFromIdentityPipe } from '../../shared/pipes/parse-user-from-identity.pipe';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { UpdateFundManagerDto } from './dto/update-fund-manager.dto';
import { FundManagerEntity } from './entities/fund-manager.entity';
import { FundManagerRO, PagedFundManagerRO } from './fund-managers.ro';
import { FundManagersService } from './fund-managers.service';
import { ParseFundManagerPipe } from './pipes/parse-fund-manager.pipe';
import { ParseGetFundManagersOptionsPipe } from './pipes/parse-get-fund-managers-options.pipe';

@ApiTags('FundManagers')
@Controller('fund_managers')
export class FundManagersController {
  public constructor(
    private readonly fundManagersService: FundManagersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all fund managers' })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'dir', type: String, required: false })
  @ApiQuery({ name: 'query', type: String, required: false })
  @ApiQuery({ name: 'organisationId', type: String, required: false })
  @ApiQuery({
    name: 'relationshipStrength',
    enum: FundManagerRelationStrength,
    required: false,
  })
  @ApiQuery({ name: 'keyRelationship', type: String, required: false })
  @ApiResponse({
    status: 200,
    description: 'List of Fund Managers',
    type: PagedFundManagerRO,
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findAll(
    @Query(ParseGetFundManagersOptionsPipe) options?: Record<string, string>,
    @Identity(ParseUserFromIdentityPipe) userEntity?: UserEntity,
  ): Promise<PagedFundManagerRO> {
    return PagedFundManagerRO.createFromPagedData(
      await this.fundManagersService.findAll(options, userEntity),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single fund manager' })
  @ApiResponse({ status: 200, description: 'The fund manager details' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FundManagerRO> {
    return FundManagerRO.createFromEntity(
      await this.fundManagersService.findOne(id),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Fund Manager' })
  @ApiResponse({
    status: 200,
    description: 'The Fund Manager has been successfully updated.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async update(
    @Param('id', ParseUUIDPipe, ParseFundManagerPipe)
    fundManager: FundManagerEntity,
    @Body() dto: UpdateFundManagerDto,
    @Body('industryTags', ParseTagsPipe) industryTags: TagEntity[],
    @Identity(ParseUserFromIdentityPipe) userEntity?: UserEntity,
  ): Promise<FundManagerRO> {
    return FundManagerRO.createFromEntity(
      await this.fundManagersService.update(
        fundManager,
        {
          ...dto,
          industryTags,
        },
        userEntity,
      ),
    );
  }
}
