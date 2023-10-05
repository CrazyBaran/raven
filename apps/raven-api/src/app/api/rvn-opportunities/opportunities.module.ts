import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';

import { AffinityIntegrationModule } from '../rvn-affinity-integration/affinity-integration.module';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OpportunityEntity, OrganisationEntity]),
    AffinityIntegrationModule,
  ],
  providers: [OrganisationService, OpportunityService, AffinityCacheService],
  controllers: [OrganisationController, OpportunityController],
})
export class OpportunitiesModule {}
