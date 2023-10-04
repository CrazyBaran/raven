export class WebhookDto {
  public id: number;
  public webhook_url: string;
  public subscriptions: string[];
  public disabled: boolean;
  public created_by: number;
}
