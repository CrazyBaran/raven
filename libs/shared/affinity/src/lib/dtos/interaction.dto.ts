export class InteractionDto {
  public name: string;
  public type: 'email' | 'call';
  public date: Date;
  public people: string[];
  public mainActor?: string;
}
