import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpportunityEntity } from './entities/opportunity.entity';
import { OrganisationEntity } from './entities/organisation.entity';

import { OrganisationController } from './organisation.controller';
import { OpportunityController } from './opportunity.controller';
import { OrganisationService } from './organisation.service';
import { OpportunityService } from './opportunity.service';
import { AffinityIntegrationModule } from '../rvn-affinity-integration/affinity-integration.module';
import { AffinityCacheService } from '../rvn-affinity-integration/cache/affinity-cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OpportunityEntity, OrganisationEntity]),
    AffinityIntegrationModule,
  ],
  providers: [OrganisationService, OpportunityService, AffinityCacheService],
  controllers: [OrganisationController, OpportunityController],
})
export class OpportunitiesModule {}
