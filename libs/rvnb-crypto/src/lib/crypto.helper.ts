import * as crypto from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { CryptoModuleOptions } from './crypto.module';

@Injectable()
export class CryptoHelper {
  protected readonly algorithm = 'aes-256-ctr';

  public constructor(
    @Inject('CRYPTO_MODULE_OPTIONS')
    private readonly options: CryptoModuleOptions,
  ) {}

  public async encrypt(text: string): Promise<string> {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.options.key,
      this.options.initVector,
    );
    let enc = cipher.update(text, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
  }

  public async decrypt(text: string): Promise<string> {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.options.key,
      this.options.initVector,
    );
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}
