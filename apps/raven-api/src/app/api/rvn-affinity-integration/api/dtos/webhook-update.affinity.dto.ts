import { AffinityWebhookSubscribeDto } from './webhook-subscribe.affinity.dto';

export class AffinityWebhookUpdateDto extends AffinityWebhookSubscribeDto {
  public disabled: boolean;
}
