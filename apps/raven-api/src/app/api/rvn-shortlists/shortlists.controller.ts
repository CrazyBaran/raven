import { EmptyResponseData, GenericResponseSchema } from '@app/rvns-api';
import { RoleEnum } from '@app/rvns-roles';
import { Roles } from '@app/rvns-roles-api';
import {
  PagedShortlistDataWithExtras,
  ShortlistData,
} from '@app/rvns-shortlists';
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
import { ParseUserFromIdentityPipe } from '../../shared/pipes/parse-user-from-identity.pipe';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { BulkAddOrganisationsDto } from './dto/bulk-add-organisations.dto';
import { CreateShortlistDto } from './dto/create-shortlist.dto';
import { DeleteOrganisationFromShortlistDto } from './dto/delete-organisation-from-shortlist.dto';
import { UpdateShortlistDto } from './dto/update-shortlist.dto';
import { ShortlistEntity } from './entities/shortlist.entity';
import { ParseGetShortlistsOptionsPipe } from './pipes/parse-get-shortlists-options.pipe';
import { ParseShortlistPipe } from './pipes/parse-shortlist.pipe';
import { PagedShortlistRO, ShortlistRO } from './shortlists.ro';
import { ShortlistsService } from './shortlists.service';

@ApiTags('Shortlists')
@Controller('shortlists')
export class ShortlistsController {
  public constructor(private readonly shortlistsService: ShortlistsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shortlists' })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'dir', type: String, required: false })
  @ApiQuery({ name: 'query', type: String, required: false })
  @ApiResponse({
    status: 200,
    description: 'List of shortlists',
    type: PagedShortlistRO,
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findAll(
    @Query(ParseGetShortlistsOptionsPipe) options?: Record<string, string>,
    @Identity(ParseUserFromIdentityPipe) userEntity?: UserEntity,
  ): Promise<PagedShortlistDataWithExtras> {
    return PagedShortlistRO.createFromPagedDataWithExtras(
      await this.shortlistsService.findAll(options, userEntity),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single shortlist' })
  @ApiResponse({ status: 200, description: 'The shortlist details' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ShortlistData> {
    return ShortlistRO.createFromEntity(
      await this.shortlistsService.findOne(id),
    );
  }

  @Patch()
  @ApiOperation({ summary: 'Bulk add organisations to shortlists' })
  @ApiResponse({
    status: 201,
    description: 'The organisation has been successfully created.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async bulkAdd(@Body() dto: BulkAddOrganisationsDto): Promise<void> {
    return await this.shortlistsService.bulkAddOrganisationsToShortlists(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an shortlist' })
  @ApiResponse({
    status: 200,
    description: 'The shortlist has been successfully updated.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async update(
    @Param('id', ParseUUIDPipe, ParseShortlistPipe)
    shortlist: ShortlistEntity,
    @Body() dto: UpdateShortlistDto,
  ): Promise<ShortlistData> {
    return ShortlistRO.createFromEntity(
      await this.shortlistsService.update(shortlist, dto),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shortlist' })
  @ApiResponse({
    status: 200,
    description: 'The shortlist has been successfully updated.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async delete(
    @Param('id', ParseUUIDPipe, ParseShortlistPipe)
    shortlistEntity: ShortlistEntity,
  ): Promise<void> {
    return await this.shortlistsService.remove(shortlistEntity.id);
  }

  @Delete(':shortlistId/organisations')
  @ApiOperation({ description: 'Delete organisations from shortlist' })
  @ApiResponse(GenericResponseSchema())
  @ApiParam({ name: 'shortlistId', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async deleteOrganisationsFromShortlist(
    @Param('shortlistId', ParseUUIDPipe, ParseShortlistPipe)
    shortlistEntity: ShortlistEntity,
    @Body() dto: DeleteOrganisationFromShortlistDto,
  ): Promise<EmptyResponseData> {
    await this.shortlistsService.deleteOrganisationsFromShortlist(
      shortlistEntity,
      dto,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new shortlist' })
  @ApiResponse({
    status: 201,
    description: 'The organisation has been successfully created.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async create(
    @Body() dto: CreateShortlistDto,
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
  ): Promise<ShortlistData> {
    return ShortlistRO.createFromEntity(
      await this.shortlistsService.create(dto, userEntity),
    );
  }
}
