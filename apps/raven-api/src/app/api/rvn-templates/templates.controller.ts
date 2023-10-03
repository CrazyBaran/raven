import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GenericCreateResponseSchema,
  GenericResponseSchema,
} from '@app/rvns-api';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { CreateTemplateDto } from './dto/create-template.dto';
import {
  FieldDefinitionData,
  FieldGroupData,
  TemplateData,
  TemplateWithRelationsData,
} from '@app/rvns-templates';
import { TemplatesService } from './templates.service';
import { TemplateEntity } from './entities/template.entity';
import { ParseTemplatePipe } from './pipes/parse-template.pipe';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CreateFieldGroupDto } from './dto/create-field-group.dto';
import { FieldGroupEntity } from './entities/field-group.entity';
import { UpdateFieldGroupDto } from './dto/update-field-group.dto';
import { ParseFieldGroupPipe } from './pipes/parse-field-group.pipe';
import { CreateFieldDefinitionDto } from './dto/create-field-definition.dto';
import { ParseUserFromIdentityPipe } from '../../shared/pipes/parse-user-from-identity.pipe';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { ParseTemplateWithGroupsAndFieldsPipe } from './pipes/parse-template-with-groups-and-fields.pipe';

@ApiTags('Templates')
@Controller('templates')
@ApiOAuth2(['openid'])
export class TemplatesController {
  public constructor(private readonly service: TemplatesService) {}

  @ApiOperation({ description: 'List templates' })
  @ApiResponse(GenericResponseSchema())
  @Get()
  public async listTemplates(): Promise<TemplateData[]> {
    return this.service.templateEntitiesToTemplateData(
      await this.service.list(),
    ) as TemplateData[];
  }

  @ApiOperation({ description: 'Get single template' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse(GenericResponseSchema())
  @Get(':id')
  public async getTemplate(
    @Param('id', ParseUUIDPipe, ParseTemplateWithGroupsAndFieldsPipe)
    templateEntity: TemplateEntity,
  ): Promise<TemplateWithRelationsData> {
    return this.service.templateWithRelationsToTemplateWithRelationsData(
      templateEntity,
    );
  }

  @ApiOperation({ description: 'Create template' })
  @ApiResponse(GenericCreateResponseSchema())
  @Post()
  public async createTemplate(
    @Body() dto: CreateTemplateDto,
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
  ): Promise<TemplateData> {
    return this.service.templateEntityToTemplateData(
      await this.service.createTemplate(dto.name, userEntity),
    ) as TemplateData;
  }

  @ApiOperation({ description: 'Update template' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse(GenericResponseSchema())
  @Patch(':id')
  public async updateTemplate(
    @Param('id', ParseUUIDPipe, ParseTemplatePipe)
    templateEntity: TemplateEntity,
    @Body() dto: UpdateTemplateDto,
  ): Promise<TemplateData> {
    return this.service.templateEntityToTemplateData(
      await this.service.updateTemplate(templateEntity, dto),
    ) as TemplateData;
  }

  @ApiOperation({ description: 'Create field group' })
  @ApiParam({ name: 'templateId', type: String })
  @ApiResponse(GenericCreateResponseSchema())
  @Post(':templateId/field-groups')
  public async createGroup(
    @Param('templateId', ParseUUIDPipe, ParseTemplatePipe)
    template: TemplateEntity,
    @Body() dto: CreateFieldGroupDto,
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
  ): Promise<TemplateData> {
    return this.service.fieldGroupEntityToFieldGroupData(
      await this.service.createFieldGroup({
        name: dto.name,
        templateId: template.id,
        order: dto.order,
        userEntity,
      }),
    ) as TemplateData;
  }

  @ApiOperation({ description: 'Update field group' })
  @ApiParam({ name: 'templateId', type: String })
  @ApiParam({ name: 'groupId', type: String })
  @ApiResponse(GenericResponseSchema())
  @Patch(':templateId/field-groups/:groupId')
  public async updateGroup(
    @Param('templateId', ParseUUIDPipe, ParseTemplatePipe)
    template: TemplateEntity,
    @Param('groupId', ParseUUIDPipe, ParseFieldGroupPipe)
    group: FieldGroupEntity,
    @Body() dto: UpdateFieldGroupDto,
  ): Promise<FieldGroupData> {
    return this.service.fieldGroupEntityToFieldGroupData(
      await this.service.updateFieldGroup(group, dto),
    ) as FieldGroupData;
  }

  @ApiOperation({ description: 'Remove field group' })
  @ApiParam({ name: 'templateId', type: String })
  @ApiParam({ name: 'groupId', type: String })
  @ApiResponse(GenericResponseSchema())
  @Delete(':templateId/field-groups/:groupId')
  public async removeGroup(
    @Param('templateId', ParseUUIDPipe, ParseTemplatePipe)
    template: TemplateEntity,
    @Param('groupId', ParseUUIDPipe, ParseFieldGroupPipe)
    group: FieldGroupEntity,
  ): Promise<void> {
    await this.service.removeFieldGroup(group);
  }

  @ApiOperation({ description: 'Create field definition' })
  @ApiParam({ name: 'templateId', type: String })
  @ApiParam({ name: 'groupId', type: String })
  @ApiResponse(GenericCreateResponseSchema())
  @Post(':templateId/field-groups/:groupId/field-definitions')
  public async createFieldDefinition(
    @Param('templateId', ParseUUIDPipe, ParseTemplatePipe)
    template: TemplateEntity,
    @Param('groupId', ParseUUIDPipe, ParseFieldGroupPipe)
    group: FieldGroupEntity,
    @Body() dto: CreateFieldDefinitionDto,
    @Identity(ParseUserFromIdentityPipe) userEntity: UserEntity,
  ): Promise<FieldDefinitionData> {
    return this.service.fieldDefinitionEntityToFieldDefinitionData(
      await this.service.createFieldDefinition({
        name: dto.name,
        type: dto.type,
        order: dto.order,
        groupId: group.id,
        userEntity,
      }),
    ) as FieldDefinitionData;
  }
}
