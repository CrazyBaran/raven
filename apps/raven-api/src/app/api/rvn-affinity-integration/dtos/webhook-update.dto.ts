import { WebhookSubscribeDto } from './webhook-subscribe.dto';

export class WebhookUpdateDto extends WebhookSubscribeDto {
  public disabled: boolean;
}
