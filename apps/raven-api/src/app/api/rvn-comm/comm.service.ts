import { environment } from '../../../environments/environment';
import { CommEmailTemplatesEnum } from './templates/comm-email-templates.enum';
import * as WelcomeActivate from './templates/email/welcome-activate.tpl';
import {
  EmailClient,
  EmailMessage,
  EmailRecipients,
} from '@azure/communication-email';
import { Injectable } from '@nestjs/common';

interface SendEmailOptions {
  readonly subject: string;
  readonly recipients: EmailRecipients;
}

@Injectable()
export class CommService {
  protected templates: Record<
    CommEmailTemplatesEnum,
    {
      html: (args: Record<string, string>) => string;
      plain: (args: Record<string, string>) => string;
    }
  > = {
    [CommEmailTemplatesEnum.WELCOME_ACTIVATE]: WelcomeActivate,
  };

  public async sendEmail(
    template: CommEmailTemplatesEnum,
    templateArgs: Record<string, string>,
    options: SendEmailOptions,
  ): Promise<boolean> {
    const client = new EmailClient(
      environment.communication.email.connectionString,
    );
    const message: EmailMessage = {
      senderAddress: environment.communication.email.senders.noReply.address,
      replyTo: [
        {
          displayName:
            environment.communication.email.senders.noReply.replyTo.displayName,
          address:
            environment.communication.email.senders.noReply.replyTo.address,
        },
      ],
      content: {
        subject: options.subject,
        html: await this.craftMessage(template, true, templateArgs),
        plainText: await this.craftMessage(template, false, templateArgs),
      },
      recipients: options.recipients,
    };
    const poller = await client.beginSend(message);
    const response = await poller.pollUntilDone();
    return response.status === 'Succeeded';
  }

  public async craftMessage(
    template: CommEmailTemplatesEnum,
    html: boolean,
    templateArgs: Record<string, string> = {},
  ): Promise<string> {
    const tpl = this.templates[template];
    if (html) {
      return tpl.html(templateArgs);
    }
    return tpl.plain(templateArgs);
  }
}
