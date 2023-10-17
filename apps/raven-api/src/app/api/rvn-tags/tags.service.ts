import { TagData, TagTypeEnum } from '@app/rvns-tags';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';
import { TagEntityFactory } from './tag-entity.factory';

export interface CreateTagOptions {
  name: string;
  type: TagTypeEnum;
  userId?: string;
  organisationId?: string;
}

@Injectable()
export class TagsService {
  public constructor(
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  public async getAllTags(type?: TagTypeEnum): Promise<TagEntity[]> {
    const where = type ? { type } : undefined;
    return this.tagsRepository.find({ where });
  }

  public async createTag(options: CreateTagOptions): Promise<TagEntity> {
    const tagEntity = TagEntityFactory.createTag(options);

    return this.tagsRepository.save(tagEntity);
  }

  public tagEntityToTagData(tag: TagEntity): TagData {
    return {
      id: tag.id,
      name: tag.name,
      type: tag.type,
    };
  }
}
