import { TagData, TagTypeEnum } from '@app/rvns-tags';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OrganisationTagEntity,
  PeopleTagEntity,
  TabTagEntity,
  TagEntity,
} from './entities/tag.entity';
import { TagEntityFactory } from './tag-entity.factory';

export interface CreateTagOptions {
  name: string;
  type: TagTypeEnum;
  userId?: string;
  organisationId?: string;
}

export type UpdateTagOptions = Omit<
  CreateTagOptions,
  'type' | 'userId' | 'organisationId'
> & {
  order?: number;
};

@Injectable()
export class TagsService {
  public constructor(
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  public async getAllTags(
    type: TagTypeEnum | null,
    query: string,
    organisationId?: string,
    skip?: number,
    take?: number,
  ): Promise<TagEntity[]> {
    const qb = this.tagsRepository.createQueryBuilder('tag');

    if (type && type === TagTypeEnum.Company) {
      qb.leftJoinAndSelect(
        'tag.organisation',
        'organisation',
      ).leftJoinAndSelect('organisation.organisationDomains', 'domains');
    }

    if (type && type === TagTypeEnum.Investor) {
      qb.leftJoinAndSelect('tag.organisation', 'organisation');
    }

    if (query) {
      qb.andWhere('LOWER(tag.name) LIKE :name', {
        name: `%${query.toLowerCase()}%`,
      });
    }
    if (organisationId) {
      qb.andWhere('tag.organisationId = :organisationId', {
        organisationId: organisationId,
      });
    }

    if (type) {
      qb.andWhere('tag.type = :tagType', { tagType: type });
    }

    qb.skip(skip || 0);
    qb.take(take || 500);

    const tags = await qb.getMany();

    return tags;
  }

  public async createTag(options: CreateTagOptions): Promise<TagEntity> {
    const tagEntity = TagEntityFactory.createTag(options);

    return this.tagsRepository.save(tagEntity);
  }

  public async updateTag(
    tagEntity: TagEntity,
    options: UpdateTagOptions,
  ): Promise<TagEntity> {
    tagEntity.name = options.name;
    if (options.order !== undefined) {
      tagEntity.order = options.order ?? 0;
    }

    return await this.tagsRepository.save(tagEntity);
  }

  public async deleteTag(tagEntity: TagEntity): Promise<void> {
    await this.tagsRepository.remove(tagEntity);
  }

  public tagEntityToTagData(
    tag: TagEntity | PeopleTagEntity | OrganisationTagEntity | TabTagEntity,
  ): TagData {
    return {
      id: tag.id,
      name: tag.name,
      type: tag.type,
      userId: (tag as PeopleTagEntity)?.userId,
      organisationId: (tag as OrganisationTagEntity)?.organisationId,
      fundManagerId: (tag as OrganisationTagEntity)?.organisation?.fundManagerId
        ?.toString()
        ?.toLowerCase(),
      tabId: (tag as TabTagEntity)?.tabId,
      domain: (tag as OrganisationTagEntity)?.organisation?.domains
        ?.toString()
        ?.toLowerCase(),
      order: tag.order,
    };
  }
}
