import { AccountEntity } from '@azure/msal-browser';
import { IPartitionManager } from '@azure/msal-node';
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class PartitionManager implements IPartitionManager {
  public constructor(private readonly cls: ClsService) {}
  public async extractKey(accountEntity: AccountEntity): Promise<string> {
    return accountEntity.localAccountId;
  }

  public async getKey(): Promise<string> {
    return await this.cls.get('localAccountId');
  }
}
