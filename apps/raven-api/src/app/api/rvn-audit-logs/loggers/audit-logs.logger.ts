import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogsLogger extends ConsoleLogger {
  public context = 'AuditLogs';
}
