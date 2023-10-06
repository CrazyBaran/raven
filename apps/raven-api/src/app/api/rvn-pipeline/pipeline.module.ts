import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineDefinitionEntity } from './entities/pipeline-definition.entity';
import { PipelineStageEntity } from './entities/pipeline-stage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PipelineDefinitionEntity, PipelineStageEntity]),
  ],
})
export class PipelineModule {}
