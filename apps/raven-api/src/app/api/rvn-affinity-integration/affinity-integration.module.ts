import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffinityOrganisation } from './entities/affinity-organisation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AffinityOrganisation])],
})
export class AffinityIntegrationModule {}
