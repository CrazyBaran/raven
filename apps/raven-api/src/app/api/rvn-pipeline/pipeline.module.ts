import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineDefinitionEntity } from './entities/pipeline-definition.entity';
import { PipelineGroupEntity } from './entities/pipeline-group.entity';
import { PipelineStageEntity } from './entities/pipeline-stage.entity';
import { PipelineController } from './pipeline.controller';
import { PipelineService } from './pipeline.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PipelineDefinitionEntity,
      PipelineStageEntity,
      PipelineGroupEntity,
    ]),
  ],
  controllers: [PipelineController],
  providers: [PipelineService],
})
export class PipelineModule {}
