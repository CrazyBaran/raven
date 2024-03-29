import {
  PagedReminderData,
  ReminderData,
  ReminderStats,
  ReminderStatus,
} from '@app/rvns-reminders';
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
import { ParseUserFromIdentityPipe } from '../../shared/pipes/parse-user-from-identity.pipe';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ReminderEntity } from './entities/reminder.entity';
import { CompanyOpportunityTag } from './interfaces/company-opportunity-tag.interface';
import { ParseCompanyOpportunityTagPipe } from './pipes/parse-company-opportunity-tags.pipe';
import { ParseGetRemindersOptionsPipe } from './pipes/parse-get-reminders-options.pipe';
import { ParseGetRemindersStatsOptionsPipe } from './pipes/parse-get-reminders-stats-options.pipe';
import { ParseReminderPipe } from './pipes/parse-reminder.pipe';
import { PagedReminderRO, ReminderRO, RemindersStatsRO } from './reminders.ro';
import { RemindersService } from './reminders.service';

@ApiTags('Reminders')
@Controller('reminders')
export class RemindersController {
  public constructor(private readonly remindersService: RemindersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all reminders',
    description:
      'By default does not return completed reminders -> use status paremeter for that.',
  })
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'field', type: String, required: false })
  @ApiQuery({ name: 'dir', type: String, required: false })
  @ApiQuery({ name: 'assignee', type: String, required: false })
  @ApiQuery({
    name: 'status',
    type: 'enum',
    enum: ReminderStatus,
    required: false,
  })
  @ApiQuery({ name: 'query', type: String, required: false })
  @ApiQuery({ name: 'organisationId', type: String, required: false })
  @ApiQuery({ name: 'opportunityId', type: String, required: false })
  @ApiResponse({
    status: 200,
    description: 'List of reminders',
    type: PagedReminderRO,
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findAll(
    @Query(ParseGetRemindersOptionsPipe) options?: Record<string, string>,
    @Identity(ParseUserFromIdentityPipe) userEntity?: UserEntity,
  ): Promise<PagedReminderData> {
    return PagedReminderRO.createFromPagedData(
      await this.remindersService.findAll(options, userEntity),
    );
  }

  @Get('/stats')
  @ApiOperation({
    summary: 'Get stats for my reminders',
    description: `Returns stats for reminders assigned to me or that I assigned to others when no params passed.
       With organisationId (+opportunityId) returns stats for organisation.
      `,
  })
  @ApiResponse({
    status: 200,
    description: 'Stats object',
    type: RemindersStatsRO,
  })
  @ApiQuery({ name: 'organisationId', type: String, required: false })
  @ApiQuery({ name: 'opportunityId', type: String, required: false })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async getStats(
    @Query(ParseGetRemindersStatsOptionsPipe) options?: Record<string, string>,
    @Identity(ParseUserFromIdentityPipe) userEntity?: UserEntity,
  ): Promise<ReminderStats> {
    return RemindersStatsRO.createFromStatsData(
      options.organisationId
        ? await this.remindersService.getStatsForOrganisation(options)
        : await this.remindersService.getStatsForUser(userEntity),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single reminder' })
  @ApiResponse({
    status: 200,
    description: 'The reminder details',
    type: ReminderRO,
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ReminderData> {
    return ReminderRO.createFromEntity(await this.remindersService.findOne(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an reminder' })
  @ApiResponse({
    status: 200,
    description: 'The reminder has been successfully updated.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async update(
    @Param('id', ParseUUIDPipe, ParseReminderPipe)
    reminder: ReminderEntity,
    @Body('tag', ParseCompanyOpportunityTagPipe) tag: CompanyOpportunityTag,
    @Body() dto: UpdateReminderDto,
    @Identity(ParseUserFromIdentityPipe) userEntity?: UserEntity,
  ): Promise<ReminderData> {
    return ReminderRO.createFromEntity(
      await this.remindersService.update(reminder, tag, dto, userEntity),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new reminder' })
  @ApiResponse({
    status: 201,
    description: 'The reminder has been successfully created.',
  })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async create(
    @Body('tag', ParseCompanyOpportunityTagPipe) tag: CompanyOpportunityTag,
    @Body() dto: CreateReminderDto,
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
  ): Promise<ReminderData> {
    return ReminderRO.createFromEntity(
      await this.remindersService.create(dto, tag, userEntity),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reminder' })
  @ApiResponse({
    status: 200,
    description: 'The reminder has been successfully deleted.',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOAuth2(['openid'])
  @Roles(RoleEnum.User, RoleEnum.SuperAdmin)
  public async delete(
    @Param('id', ParseUUIDPipe, ParseReminderPipe)
    reminderEntity: ReminderEntity,
    @Identity(ParseUserFromIdentityPipe) userEntity?: UserEntity,
  ): Promise<void> {
    return await this.remindersService.remove(reminderEntity, userEntity);
  }
}
