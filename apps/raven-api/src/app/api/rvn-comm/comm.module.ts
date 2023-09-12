import { CryptoModule } from '@app/rvnb-crypto';

import { environment } from '../../../environments/environment';
import { BullService } from '../../core/bull.service';
import { CommService } from './comm.service';
import { CommSendEmailProcessorLogger } from './queues/comm-send-email/comm-send-email-processor.logger';
import {
  COMM_SEND_EMAIL_QUEUE,
  CommSendEmailProcessor,
} from './queues/comm-send-email/comm-send-email.processor';
import { CommSendEmailProducer } from './queues/comm-send-email/comm-send-email.producer';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // queues
    BullService.registerQueue([
      {
        name: COMM_SEND_EMAIL_QUEUE,
        order: 0,
        description: 'Send email',
        defaultJobOptions: {
          attempts: 3,
          // exponential fn: 2 ^ ($attempts - 1) * $delay
          backoff: { type: 'exponential', delay: 60000 },
        },
      },
    ]),
    CryptoModule.register({
      key: environment.communication.email.crypto.key,
      initVector: environment.communication.email.crypto.initVector,
    }),
  ],
  providers: [
    CommService,
    // queues
    CommSendEmailProducer,
    CommSendEmailProcessor,
    CommSendEmailProcessorLogger,
  ],
  exports: [CommService],
})
export class CommModule {}
