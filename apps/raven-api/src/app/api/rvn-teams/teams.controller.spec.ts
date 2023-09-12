import { EntityManager } from 'typeorm';

import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('TeamsController', () => {
  let controller: TeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TeamsService,
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
      controllers: [TeamsController],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
