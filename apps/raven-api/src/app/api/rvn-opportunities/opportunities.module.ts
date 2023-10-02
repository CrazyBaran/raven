import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';

import { OrganisationController } from './organisation.controller';
import { OpportunityController } from './opportunity.controller';
import { OrganisationService } from './organisation.service';
import { OpportunityService } from './opportunity.service';

@Module({
  imports: [TypeOrmModule.forFeature([OpportunityEntity, OrganisationEntity])],
  providers: [OrganisationService, OpportunityService],
  controllers: [OrganisationController, OpportunityController],
})
export class OpportunitiesModule {}
