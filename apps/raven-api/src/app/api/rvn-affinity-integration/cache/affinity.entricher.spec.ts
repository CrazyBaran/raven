import { Test, TestingModule } from '@nestjs/testing';
import { AffinityCacheService } from './affinity-cache.service';
import { AffinityEnricher } from './affinity.enricher';

describe('AffinityEnricher', () => {
  let enricher: AffinityEnricher;
  let mockAffinityCacheService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AffinityEnricher,
        {
          provide: AffinityCacheService,
          useValue: mockAffinityCacheService,
        },
      ],
    }).compile();

    enricher = module.get<AffinityEnricher>(AffinityEnricher);
  });

  it('should be defined', () => {
    expect(enricher).toBeDefined();
  });
});
