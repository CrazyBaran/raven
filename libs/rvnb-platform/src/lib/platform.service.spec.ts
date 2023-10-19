import Redis from 'ioredis';
import { EntityManager } from 'typeorm';

import { Test } from '@nestjs/testing';
import { PlatformService } from './platform.service';

describe('PlatformService', () => {
  let service: PlatformService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PlatformService,
        { provide: 'PLATFORM_MODULE_OPTIONS', useValue: {} },
        { provide: EntityManager, useValue: {} },
        { provide: Redis, useValue: {} },
      ],
    }).compile();

    service = module.get<PlatformService>(PlatformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
