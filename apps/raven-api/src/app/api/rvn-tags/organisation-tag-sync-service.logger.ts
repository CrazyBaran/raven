import { ConsoleLogger } from '@nestjs/common';

export class OrganisationTagSyncServiceLogger extends ConsoleLogger {
  public context = 'OrganisationTagSyncService';
}
