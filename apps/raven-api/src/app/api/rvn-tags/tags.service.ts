import { TagData, TagTypeEnum } from '@app/rvns-tags';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import {
  OrganisationTagEntity,
  PeopleTagEntity,
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
>;

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
    const where = type ? { type } : {};
    if (query) {
      where['name'] = ILike(`%${query}%`);
    }
    if (organisationId) {
      where['organisationId'] = organisationId;
    }
    return await this.tagsRepository.find({
      where,
      skip: skip || 0,
      take: take || 0,
    });
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
    return await this.tagsRepository.save(tagEntity);
  }

  public async deleteTag(tagEntity: TagEntity): Promise<void> {
    await this.tagsRepository.remove(tagEntity);
  }

  public tagEntityToTagData(
    tag: TagEntity | PeopleTagEntity | OrganisationTagEntity,
  ): TagData {
    return {
      id: tag.id,
      name: tag.name,
      type: tag.type,
      userId: (tag as PeopleTagEntity).userId,
      organisationId: (tag as OrganisationTagEntity).organisationId,
    };
  }
}
