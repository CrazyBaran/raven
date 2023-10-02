import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { Organisation } from './entities/organisation.entity';
import { OrganisationController } from './organisation.controller';
import { OpportunityController } from './opportunity.controller';
import { OrganisationService } from './organisation.service';
import { OpportunityService } from './opportunity.service';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity, Organisation])],
  providers: [OrganisationService, OpportunityService],
  controllers: [OrganisationController, OpportunityController],
})
export class OpportunitiesModule {}
