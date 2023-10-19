import { DynamicModule, Module } from '@nestjs/common';
import { CryptoHelper } from './crypto.helper';

const CRYPTO_MODULE_OPTIONS = 'CRYPTO_MODULE_OPTIONS';

export interface CryptoModuleOptions {
  readonly key: string;
  readonly initVector: string;
}

@Module({
  providers: [CryptoHelper],
  exports: [CryptoHelper],
})
export class CryptoModule {
  public static register(options: CryptoModuleOptions): DynamicModule {
    return {
      module: CryptoModule,
      providers: [
        CryptoHelper,
        { provide: CRYPTO_MODULE_OPTIONS, useValue: options },
      ],
    };
  }
}
