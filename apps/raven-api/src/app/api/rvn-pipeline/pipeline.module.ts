import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineDefinitionEntity } from './entities/pipeline-definition.entity';
import { PipelineGroupEntity } from './entities/pipeline-group.entity';
import { PipelineStageEntity } from './entities/pipeline-stage.entity';
import { PipelineViewEntity } from './entities/pipeline-view.entity';
import { PipelineUtilityService } from './pipeline-utility.service';
import { PipelineController } from './pipeline.controller';
import { PipelineService } from './pipeline.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PipelineDefinitionEntity,
      PipelineStageEntity,
      PipelineGroupEntity,
      PipelineViewEntity,
    ]),
  ],
  controllers: [PipelineController],
  providers: [PipelineService, PipelineUtilityService],
  exports: [PipelineUtilityService],
})
export class PipelineModule {}
