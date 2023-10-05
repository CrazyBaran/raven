import { ConsoleLogger } from '@nestjs/common';

export class AffinityServiceLogger extends ConsoleLogger {
  public context = 'AffinityService';
}
