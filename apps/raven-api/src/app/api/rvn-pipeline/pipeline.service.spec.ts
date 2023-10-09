import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PipelineDefinitionEntity } from './entities/pipeline-definition.entity';
import { PipelineStageEntity } from './entities/pipeline-stage.entity';
import { PipelineService } from './pipeline.service';

describe('PipelineService', () => {
  let service: PipelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipelineService,
        {
          provide: getRepositoryToken(PipelineDefinitionEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PipelineStageEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PipelineService>(PipelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
