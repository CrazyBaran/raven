import { ConsoleLogger } from '@nestjs/common';

export class UsersServiceLogger extends ConsoleLogger {
  public context = 'UsersService';
}
