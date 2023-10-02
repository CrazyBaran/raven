import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  GenericCreateResponseSchema,
  GenericResponseSchema,
  UserData,
} from '@app/rvns-api';
import { Identity } from '../rvn-users/decorators/identity.decorator';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplateData } from '@app/rvns-templates';
import { TemplatesService } from './templates.service';
import { TemplateEntity } from './entities/template.entity';
import { ParseTemplatePipe } from './pipes/parse-template.pipe';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('templates')
export class TemplatesController {
  public constructor(private readonly service: TemplatesService) {}

  @ApiOperation({ description: 'List templates' })
  @ApiResponse(GenericResponseSchema())
  @Get()
  public async list(): Promise<TemplateData[]> {
    return this.service.templateEntitiesToTemplateData(
      await this.service.list(),
    ) as TemplateData[];
  }

  @ApiOperation({ description: 'Create template' })
  @ApiResponse(GenericCreateResponseSchema())
  @Post()
  public async create(
    @Body() dto: CreateTemplateDto,
    @Identity() identity: UserData,
  ): Promise<TemplateData> {
    return this.service.templateEntityToTemplateData(
      await this.service.create(dto.name, identity.id),
    ) as TemplateData;
  }

  @ApiOperation({ description: 'Update template' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse(GenericResponseSchema())
  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe, ParseTemplatePipe)
    templateEntity: TemplateEntity,
    @Body() dto: UpdateTemplateDto,
  ): Promise<TemplateData> {
    return this.service.templateEntityToTemplateData(
      await this.service.update(templateEntity, dto),
    ) as TemplateData;
  }
}
