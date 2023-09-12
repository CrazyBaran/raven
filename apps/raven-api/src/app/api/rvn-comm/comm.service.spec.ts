import { CommService } from './comm.service';
import { Test } from '@nestjs/testing';

describe('CommService', () => {
  let service: CommService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CommService],
    }).compile();

    service = module.get<CommService>(CommService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
