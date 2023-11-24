import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { FileEntity } from './entities/file.entity';

interface UpdateOptions {
  tagEntities: TagEntity[];
}

@Injectable()
export class FileService {
  public constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}
  public async createOrUpdate(
    fileEntity: FileEntity | null,
    options: UpdateOptions,
  ): Promise<FileEntity> {
    if (!fileEntity) {
      // TODO check file details and create new file
    }
    fileEntity.tags = options.tagEntities;
    return await this.fileRepository.save(fileEntity);
  }
}
