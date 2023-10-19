import { ConsoleLogger } from '@nestjs/common';

export class StorageAccountClientLogger extends ConsoleLogger {
  public context = 'StorageAccountClient';
}
