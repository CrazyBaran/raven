import { ConsoleLogger } from '@nestjs/common';

export class AclServiceLogger extends ConsoleLogger {
  public context = 'AclService';
}
