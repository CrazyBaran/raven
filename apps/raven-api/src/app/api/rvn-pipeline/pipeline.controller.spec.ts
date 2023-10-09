import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { PipelineController } from './pipeline.controller';
import { PipelineService } from './pipeline.service';

describe('PipelineController', () => {
  let controller: PipelineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PipelineController],
      providers: [
        {
          provide: PipelineService,
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PipelineController>(PipelineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
