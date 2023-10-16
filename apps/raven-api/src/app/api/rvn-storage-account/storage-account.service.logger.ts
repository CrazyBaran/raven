import {ConsoleLogger} from "@nestjs/common";

export class StorageAccountServiceLogger extends ConsoleLogger {
  public context = 'StorageAccountService';
}
