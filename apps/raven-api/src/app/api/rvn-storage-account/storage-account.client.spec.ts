import { BlobServiceClient } from '@azure/storage-blob';
import { Test } from '@nestjs/testing';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { StorageAccountClient } from './storage-account.client';

describe('StorageAccountClient', () => {
  let client: StorageAccountClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        StorageAccountClient,
        {
          provide: BlobServiceClient,
          useValue: {},
        },
        {
          provide: RavenLogger,
          useValue: {
            setContext: jest.fn(),
          },
        },
      ],
    }).compile();

    client = module.get<StorageAccountClient>(StorageAccountClient);
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });
});
