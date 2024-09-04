import { FundManagerContactData } from '@app/rvns-fund-managers';
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
import { FundManagerRelationStrength, PagedData } from 'rvns-shared';
import { ParseTagsPipe } from '../../shared/pipes/parse-tags.pipe';
import { ParseUserFromIdentityPipe } from '../../shared/pipes/parse-user-from-identity.pipe';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { UpdateFundManagerDto } from './dto/update-fund-manager.dto';
import { FundManagerContactEntity } from './entities/fund-manager-contact.entity';
import { FundManagerEntity } from './entities/fund-manager.entity';
import { FundManagerRO, PagedFundManagerRO } from './fund-managers.ro';
import { FundManagersService } from './fund-managers.service';
import { ParseContactPipe } from './pipes/parse-contact.pipe';
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

  @Get(':id/contacts')
  @ApiOperation({ summary: 'Get all fund manager contacts' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'The fund manager contacts' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findAllContacts(
    @Param('id') id: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PagedData<Partial<FundManagerContactData>>> {
    return this.fundManagersService.findAllContacts(id, skip, take);
  }

  @Post(':id/contacts')
  @ApiOperation({ description: 'Create fund manager contact' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 201, description: 'The fund manager contact details' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public createContact(
    @Param('id', ParseUUIDPipe, ParseFundManagerPipe)
    fundManager: FundManagerEntity,
    @Body() dto: CreateContactDto,
  ): Promise<FundManagerContactData> {
    return this.fundManagersService.createContact(fundManager, dto);
  }

  @Get('contacts/:id')
  @ApiOperation({ summary: 'Get a single fund manager contact' })
  @ApiResponse({ status: 200, description: 'The fund manager contact details' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findOneContact(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FundManagerContactData> {
    return this.fundManagersService.findOneContact(id);
  }

  @Patch('contacts/:id')
  @ApiOperation({ summary: 'Update a fund manager contact' })
  @ApiResponse({
    status: 200,
    description: 'The fund manager contact has been successfully updated.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async updateContact(
    @Param('id', ParseUUIDPipe, ParseContactPipe)
    contact: FundManagerContactEntity,
    @Body() dto: UpdateContactDto,
  ): Promise<FundManagerContactData> {
    return this.fundManagersService.updateContact(contact, dto);
  }

  @Delete('contacts/:id')
  @ApiOperation({ summary: 'Remove a single fund manager contact' })
  @ApiResponse({ status: 200, description: 'The fund manager contact removed' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async removeOneContact(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<boolean> {
    return this.fundManagersService.removeOneContact(id);
  }
}
