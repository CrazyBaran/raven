import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OpportunityEntity, OrganisationEntity])],
})
export class OpportunitiesModule {}
