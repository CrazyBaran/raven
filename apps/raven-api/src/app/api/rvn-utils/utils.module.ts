import { Global, Module } from '@nestjs/common';
import { DomainResolver } from './domain.resolver';

@Global()
@Module({ providers: [DomainResolver], exports: [DomainResolver] })
export class UtilsModule {}
