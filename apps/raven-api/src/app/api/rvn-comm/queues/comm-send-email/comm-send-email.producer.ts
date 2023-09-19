import { CryptoHelper } from '@app/rvnb-crypto';
import { AbstractSimpleQueueProducer, EnqueueJobEvent } from '@app/rvns-bull';

import {
  COMM_SEND_EMAIL_QUEUE,
  COMM_SEND_EMAIL_QUEUE__SEND,
  CommSendEmailJobData,
} from './comm-send-email.processor';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from '@taskforcesh/bullmq-pro';
import { InjectQueue } from '@taskforcesh/nestjs-bullmq-pro';

@Injectable()
export class CommSendEmailProducer extends AbstractSimpleQueueProducer {
  public constructor(
    @InjectQueue(COMM_SEND_EMAIL_QUEUE)
    protected readonly queue: Queue<CommSendEmailJobData>,
    protected readonly cryptoHelper: CryptoHelper,
  ) {
    super();
  }

  @OnEvent(`ms.bg.enqueue.${COMM_SEND_EMAIL_QUEUE__SEND}`)
  protected async process(
    event: EnqueueJobEvent<CommSendEmailJobData>,
  ): Promise<void> {
    await this.add<CommSendEmailJobData<string>>(
      COMM_SEND_EMAIL_QUEUE__SEND,
      {
        ...event.data,
        templateArgs: {
          ...event.data.templateArgs,
          // encrypt sensitive args
          encrypted: event.data.templateArgs.encrypted
            ? await this.cryptoHelper.encrypt(
                JSON.stringify(event.data.templateArgs.encrypted),
              )
            : undefined,
        },
      },
      event.options,
    );
  }
}
