import { ConsoleLogger } from '@nestjs/common';

export class NotesServiceLogger extends ConsoleLogger {
  public context = 'NotesService';
}
