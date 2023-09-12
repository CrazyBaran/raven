import { EntityManager } from 'typeorm';

import { AclService } from '../acl.service';
import { ParseShareResourcePipe } from './parse-share-resource.pipe';
import { Test, TestingModule } from '@nestjs/testing';

describe('ParseShareResourcePipe', () => {
  let pipe: ParseShareResourcePipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParseShareResourcePipe,
        {
          provide: AclService,
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
    }).compile();

    pipe = module.get<ParseShareResourcePipe>(ParseShareResourcePipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});
