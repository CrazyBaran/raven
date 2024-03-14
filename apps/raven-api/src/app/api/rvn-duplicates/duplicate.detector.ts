import { TagTypeEnum } from '@app/rvns-tags';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NoteEntity } from '../rvn-notes/entities/note.entity';
import { OrganisationDomainEntity } from '../rvn-opportunities/entities/organisation-domain.entity';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { ReminderEntity } from '../rvn-reminders/entities/reminder.entity';
import { OrganisationTagEntity } from '../rvn-tags/entities/tag.entity';
import { DomainResolver } from '../rvn-utils/domain.resolver';

export class DuplicatesDto {
  public count: number;
  public duplicates: DuplicateDto[];
}

export class DuplicateDto {
  public domain: string;
  public canRemove: string[];
  public cannotRemove: {
    organisation: string;
    reasons: string[];
  }[];
}

export class CandidatesDto {
  public unresolvable: string[];
  public toDelete: string[];
}

@Injectable()
export class DuplicateDetector {
  public constructor(
    @InjectRepository(OrganisationDomainEntity)
    private readonly organisationDomainRepository: Repository<OrganisationDomainEntity>,
    @InjectRepository(OrganisationEntity)
    private readonly organisationRepository: Repository<OrganisationEntity>,
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
    @InjectRepository(ReminderEntity)
    private readonly reminderRepository: Repository<ReminderEntity>,
    private readonly domainResolver: DomainResolver,
  ) {}

  public async getDuplicates(): Promise<DuplicatesDto> {
    const domains = await this.organisationDomainRepository.find();

    const organisationsFromNoteTags = await this.getOrganisationsFromNoteTags();
    const organisationsFromReminderTags =
      await this.getOrganisationsFromReminderTags();
    const organisationsFromTags = organisationsFromNoteTags.concat(
      organisationsFromReminderTags,
    );

    const domainMap: { [key: string]: string[] } = {};
    for (const domain of domains) {
      const domainName = this.domainResolver.cleanDomain(domain.domain);
      if (domainMap[domainName]) {
        domainMap[domainName].push(domain.organisationId);
      } else {
        domainMap[domainName] = [domain.organisationId];
      }
    }

    const duplicates: DuplicatesDto = {
      count: 0,
      duplicates: [],
    };

    for (const domain in domainMap) {
      if (domainMap[domain].length > 1) {
        if (domain === 'placeholder.com') {
          continue;
        }
        duplicates.count += 1;
        duplicates.duplicates.push(
          await this.getDuplicate(
            domain,
            domainMap[domain],
            organisationsFromTags,
          ),
        );
      }
    }

    return duplicates;
  }

  public async getDuplicate(
    domain: string,
    organisationIds: string[],
    organisationsFromTags: string[],
  ): Promise<DuplicateDto> {
    const duplicate: DuplicateDto = {
      domain: domain,
      canRemove: [],
      cannotRemove: [],
    };

    const organisations = await this.organisationRepository.find({
      where: { id: In(organisationIds) },
      relations: ['opportunities', 'shortlists', 'organisationDomains'],
    });

    for (const organisation of organisations) {
      const reasons: string[] = [];
      if (organisation.opportunities.length > 0) {
        reasons.push('Has opportunities');
      }
      if (organisation.shortlists.length > 0) {
        reasons.push('Is in shortlists');
      }
      if (organisation.sharepointDirectoryId) {
        reasons.push('Has sharepoint directory');
      }
      if (organisationsFromTags.includes(organisation.id)) {
        reasons.push('Tag used in notes');
      }

      if (reasons.length === 0) {
        duplicate.canRemove.push(organisation.id);
      } else {
        duplicate.cannotRemove.push({
          organisation: organisation.id,
          reasons: reasons,
        });
      }
    }

    return duplicate;
  }

  public async fixDomains(): Promise<void> {
    const chunkSize = 1000;
    const count = await this.organisationDomainRepository.count();
    const chunks = Math.ceil(count / chunkSize);
    for (let i = 0; i < chunks; i++) {
      const domains = await this.organisationDomainRepository.find({
        skip: i * chunkSize,
        take: chunkSize,
      });
      const domainsToCreate: OrganisationDomainEntity[] = [];
      const domainsToDelete: OrganisationDomainEntity[] = [];
      for (const domain of domains) {
        const cleanedDomain = this.domainResolver.cleanDomain(domain.domain);
        if (cleanedDomain !== domain.domain) {
          domainsToDelete.push(domain);
          const newDomain = this.organisationDomainRepository.create({
            organisationId: domain.organisationId,
            domain: cleanedDomain,
          });
          domainsToCreate.push(newDomain);
        }
      }
      await this.organisationDomainRepository.remove(domainsToDelete);
      await this.organisationDomainRepository.save(domainsToCreate);
    }
  }

  public async getDeletionCandidates(
    duplicates: DuplicatesDto,
  ): Promise<CandidatesDto> {
    const candidates: CandidatesDto = {
      unresolvable: [],
      toDelete: [],
    };

    for (const duplicate of duplicates.duplicates) {
      if (duplicate.domain === 'placeholder.com') {
        continue;
      }
      if (
        duplicate.canRemove.length === 0 &&
        duplicate.cannotRemove.length > 1
      ) {
        candidates.unresolvable.push(duplicate.domain);
      }
      if (duplicate.cannotRemove.length === 0) {
        candidates.toDelete.push(...duplicate.canRemove.slice(1));
      } else {
        candidates.toDelete.push(...duplicate.canRemove);
      }
    }

    return candidates;
  }

  private async getOrganisationsFromNoteTags(): Promise<string[]> {
    const allNotes = await this.noteRepository.find({
      relations: ['tags', 'complexTags', 'complexTags.tags'],
      where: {},
    });

    const tags = allNotes.map((note) => note.tags).flat();
    const complexTags = allNotes.map((note) => note.complexTags).flat();

    const tagsOrganisations = tags
      .map((tag) => (tag.type === TagTypeEnum.Company ? tag : null))
      .filter((tag) => tag !== null);
    const complexTagsOrganisations = complexTags
      .map((complexTag) => complexTag.tags)
      .flat()
      .map((tag) => (tag.type === TagTypeEnum.Company ? tag : null))
      .filter((tag) => tag !== null);

    const allCompanyTags = tagsOrganisations.concat(complexTagsOrganisations);

    const allCompanies = allCompanyTags.map(
      (tag) => (tag as OrganisationTagEntity).organisationId,
    );

    return allCompanies;
  }

  private async getOrganisationsFromReminderTags(): Promise<string[]> {
    const allReminders = await this.reminderRepository.find({
      relations: ['tag', 'tag.tags'],
      where: {},
    });

    const complexTags = allReminders.map((note) => note.tag);
    const complexTagsOrganisations = complexTags
      .map((complexTag) => complexTag?.tags)
      .flat()
      .filter((tags) => tags !== null)
      .map((tag) => (tag?.type === TagTypeEnum.Company ? tag : null))
      .filter((tag) => tag !== null);

    const allCompanies = complexTagsOrganisations.map(
      (tag) => (tag as OrganisationTagEntity).organisationId,
    );

    return allCompanies;
  }
}
