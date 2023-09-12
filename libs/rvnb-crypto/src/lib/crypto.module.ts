import { CryptoHelper } from './crypto.helper';
import { DynamicModule, Module } from '@nestjs/common';

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
