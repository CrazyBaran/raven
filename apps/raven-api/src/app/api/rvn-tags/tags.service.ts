import { TagData, TagTypeEnum } from '@app/rvns-tags';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';
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
  ): Promise<TagEntity[]> {
    const where = type ? { type } : {};
    if (query) {
      where['name'] = ILike(`%${query}%`);
    }
    return this.tagsRepository.find({ where });
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

  public tagEntityToTagData(tag: TagEntity): TagData {
    return {
      id: tag.id,
      name: tag.name,
      type: tag.type,
    };
  }
}
