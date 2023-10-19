import { BlobServiceClient } from '@azure/storage-blob';
import { Test } from '@nestjs/testing';
import { StorageAccountClient } from './storage-account.client';
import { StorageAccountClientLogger } from './storage-account.client.logger';

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
          provide: StorageAccountClientLogger,
          useValue: {},
        },
      ],
    }).compile();

    client = module.get<StorageAccountClient>(StorageAccountClient);
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });
});
