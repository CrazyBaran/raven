import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineDefinitionEntity } from '../rvn-pipeline/entities/pipeline-definition.entity';
import { PipelineStageEntity } from '../rvn-pipeline/entities/pipeline-stage.entity';
import { TabTagEntity, TagEntity } from '../rvn-tags/entities/tag.entity';
import { FieldDefinitionEntity } from '../rvn-templates/entities/field-definition.entity';
import { FieldGroupEntity } from '../rvn-templates/entities/field-group.entity';
import { TabEntity } from '../rvn-templates/entities/tab.entity';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { AbstractComparer } from './comparer';
import { PipelineStaticDataService } from './pipeline-static-data.service';
import { StaticDataController } from './static-data.controller';
import { TemplateStaticDataService } from './template-static-data.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PipelineDefinitionEntity,
      PipelineStageEntity,
      TemplateEntity,
      FieldDefinitionEntity,
      FieldGroupEntity,
      TabEntity,
      TabTagEntity,
      TagEntity,
    ]),
  ],
  controllers: [StaticDataController],
  providers: [
    PipelineStaticDataService,
    TemplateStaticDataService,
    AbstractComparer,
  ],
})
export class StaticDataModule {}
