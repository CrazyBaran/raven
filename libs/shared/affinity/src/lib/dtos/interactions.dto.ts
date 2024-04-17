import { InteractionDto } from './interaction.dto';

export class InteractionsDto {
  public items: InteractionDto[];
  public nextInteraction: Date | null;
}
