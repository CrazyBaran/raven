import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareOpportunityEntity } from '../rvn-acl/entities/share-opportunity.entity';
import { NoteEntity } from '../rvn-notes/entities/note.entity';
import { OpportunityEntity } from '../rvn-opportunities/entities/opportunity.entity';
import { OrganisationDomainEntity } from '../rvn-opportunities/entities/organisation-domain.entity';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { ReminderEntity } from '../rvn-reminders/entities/reminder.entity';
import { ComplexTagEntity } from '../rvn-tags/entities/complex-tag.entity';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { TemplateEntity } from '../rvn-templates/entities/template.entity';
import { DuplicateDetector } from './duplicate.detector';
import { DuplicatesController } from './duplicates.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OpportunityEntity,
      OrganisationEntity,
      TagEntity,
      TemplateEntity,
      ShareOpportunityEntity,
      OrganisationDomainEntity,
      NoteEntity,
      ComplexTagEntity,
      ReminderEntity,
    ]),
  ],
  providers: [DuplicateDetector],
  controllers: [DuplicatesController],
})
export class DuplicatesModule {}
