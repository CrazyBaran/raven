import { CryptoHelper } from '@app/rvnb-crypto';

import { CommService } from '../../comm.service';
import { CommSendEmailProcessorLogger } from './comm-send-email-processor.logger';
import { CommSendEmailProcessor } from './comm-send-email.processor';
import { Test, TestingModule } from '@nestjs/testing';

describe('CommSendEmailProcessor', () => {
  let processor: CommSendEmailProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommSendEmailProcessor,
        {
          provide: CommService,
          useValue: {},
        },
        {
          provide: CryptoHelper,
          useValue: {},
        },
        {
          provide: CommSendEmailProcessorLogger,
          useValue: {},
        },
      ],
    }).compile();

    processor = await module.resolve<CommSendEmailProcessor>(
      CommSendEmailProcessor
    );
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});
