import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffinityOrganisation } from './entities/affinity-organisation.entity';
import { AffinityService } from './affinity.service';
import { AffinityController } from './affinity.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([AffinityOrganisation]),
    HttpModule,
    ConfigModule,
  ],
  providers: [AffinityService],
  controllers: [AffinityController],
})
export class AffinityIntegrationModule {}
