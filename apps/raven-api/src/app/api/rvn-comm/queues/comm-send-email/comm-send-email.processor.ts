import { CryptoHelper } from '@app/rvnb-crypto';
import { AbstractSimpleQueueProcessor } from '@app/rvns-bull';

import { EmailRecipients } from '@azure/communication-email';
import { Job } from '@taskforcesh/bullmq-pro';
import { Processor } from '@taskforcesh/nestjs-bullmq-pro';
import { CommService } from '../../comm.service';
import { CommEmailTemplatesEnum } from '../../templates/comm-email-templates.enum';
import { CommSendEmailProcessorLogger } from './comm-send-email-processor.logger';

export const COMM_SEND_EMAIL_QUEUE = 'CommSendEmailQueue';
export const COMM_SEND_EMAIL_QUEUE__SEND = 'CommSendEmailQueue-Send';

export interface CommSendEmailJobData<EncryptedType = Record<string, string>> {
  readonly template: CommEmailTemplatesEnum;
  readonly templateArgs: {
    readonly raw?: Record<string, string>;
    readonly encrypted?: EncryptedType;
  };
  readonly subject: string;
  readonly recipients: EmailRecipients;
}

@Processor(COMM_SEND_EMAIL_QUEUE, {
  concurrency: 6,
  group: { concurrency: 3 },
  removeOnComplete: { age: 2592000 }, // keep email jobs for a month
})
export class CommSendEmailProcessor extends AbstractSimpleQueueProcessor<CommSendEmailJobData> {
  public constructor(
    protected readonly commService: CommService,
    protected readonly cryptoHelper: CryptoHelper,
    protected readonly logger: CommSendEmailProcessorLogger,
  ) {
    super(logger);
  }

  public async process(
    job: Job<CommSendEmailJobData<string>>,
  ): Promise<boolean> {
    // prepare template args
    const templateArgs = {
      ...(job.data.templateArgs.raw || {}),
      // decrypt sensitive args
      ...(job.data.templateArgs.encrypted
        ? JSON.parse(
            await this.cryptoHelper.decrypt(job.data.templateArgs.encrypted),
          )
        : {}),
    };
    return await this.commService.sendEmail(job.data.template, templateArgs, {
      subject: job.data.subject,
      recipients: job.data.recipients,
    });
  }
}
