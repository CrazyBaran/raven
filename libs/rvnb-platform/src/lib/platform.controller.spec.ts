import { EntityManager } from 'typeorm';

import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('PlatformController', () => {
  let controller: PlatformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: EntityManager, useValue: {} },
        { provide: PlatformService, useValue: {} },
      ],
      controllers: [PlatformController],
    }).compile();

    controller = module.get<PlatformController>(PlatformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
