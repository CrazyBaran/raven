import { Global, Module } from '@nestjs/common';
import { RavenLogger } from './raven.logger';

@Global()
@Module({ providers: [RavenLogger], exports: [RavenLogger] })
export class LoggerModule {}
