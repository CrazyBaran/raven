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
  UserData,
} from '@app/rvns-api';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { CreateTemplateDto } from './dto/create-template.dto';
import {
  FieldDefinitionData,
  FieldGroupData,
  TemplateData,
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
  @ApiResponse(GenericResponseSchema())
  @Get()
  public async getTemplate(): Promise<TemplateData[]> {
    return this.service.templateEntitiesToTemplateData(
      await this.service.list(),
    ) as TemplateData[];
  }

  @ApiOperation({ description: 'Create template' })
  @ApiResponse(GenericCreateResponseSchema())
  @Post()
  public async createTemplate(
    @Body() dto: CreateTemplateDto,
    @Identity() identity: UserData,
  ): Promise<TemplateData> {
    return this.service.templateEntityToTemplateData(
      await this.service.createTemplate(dto.name, identity.id),
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
  @Post(':templateId')
  public async createGroup(
    @Param('templateId', ParseUUIDPipe, ParseTemplatePipe)
    template: TemplateEntity,
    @Body() dto: CreateFieldGroupDto,
    @Identity() identity: UserData,
  ): Promise<TemplateData> {
    return this.service.fieldGroupEntityToFieldGroupData(
      await this.service.createFieldGroup({
        name: dto.name,
        templateId: template.id,
        order: dto.order,
        createdById: identity.id,
      }),
    ) as TemplateData;
  }

  @ApiOperation({ description: 'Update field group' })
  @ApiParam({ name: 'groupId', type: String })
  @ApiResponse(GenericResponseSchema())
  @Patch(':groupId')
  public async updateGroup(
    @Param('groupId', ParseUUIDPipe, ParseFieldGroupPipe)
    group: FieldGroupEntity,
    @Body() dto: UpdateFieldGroupDto,
  ): Promise<FieldGroupData> {
    return this.service.fieldGroupEntityToFieldGroupData(
      await this.service.updateFieldGroup(group, dto),
    ) as FieldGroupData;
  }

  @ApiOperation({ description: 'Remove field group' })
  @ApiParam({ name: 'groupId', type: String })
  @ApiResponse(GenericResponseSchema())
  @Delete(':groupId')
  public async removeGroup(
    @Param('groupId', ParseUUIDPipe, ParseFieldGroupPipe)
    group: FieldGroupEntity,
  ): Promise<void> {
    await this.service.removeFieldGroup(group);
  }

  @ApiOperation({ description: 'Create field definition' })
  @ApiParam({ name: 'groupId', type: String })
  @ApiResponse(GenericCreateResponseSchema())
  @Post(':groupId')
  public async createFieldDefinition(
    @Param('groupId', ParseUUIDPipe, ParseFieldGroupPipe)
    group: FieldGroupEntity,
    @Body() dto: CreateFieldDefinitionDto,
    @Identity() identity: UserData,
  ): Promise<FieldDefinitionData> {
    return this.service.fieldDefinitionEntityToFieldDefinitionData(
      await this.service.createFieldDefinition({
        name: dto.name,
        type: dto.type,
        order: dto.order,
        groupId: group.id,
        createdById: identity.id,
      }),
    ) as FieldDefinitionData;
  }
}
