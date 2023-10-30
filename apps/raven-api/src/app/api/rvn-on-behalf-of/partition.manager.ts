import { AccountEntity } from '@azure/msal-browser';
import { IPartitionManager } from '@azure/msal-node';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PartitionManager implements IPartitionManager {
  public async extractKey(accountEntity: AccountEntity): Promise<string> {
    return accountEntity.localAccountId;
  }

  public async getKey(): Promise<string> {
    return Promise.resolve('');
  }
}
