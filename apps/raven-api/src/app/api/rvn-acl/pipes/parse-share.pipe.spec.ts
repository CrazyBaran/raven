import { EntityManager } from 'typeorm';

import { AclService } from '../acl.service';
import { ParseSharePipe } from './parse-share.pipe';
import { Test, TestingModule } from '@nestjs/testing';

describe('ParseSharePipe', () => {
  let pipe: ParseSharePipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParseSharePipe,
        {
          provide: EntityManager,
          useValue: {},
        },
        {
          provide: AclService,
          useValue: {},
        },
      ],
    }).compile();

    pipe = module.get<ParseSharePipe>(ParseSharePipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});
