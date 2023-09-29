import { Test, TestingModule } from '@nestjs/testing';
import { AffinityService } from './affinity.service';

describe('AffinityService', () => {
  let service: AffinityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffinityService],
    }).compile();

    service = module.get<AffinityService>(AffinityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
