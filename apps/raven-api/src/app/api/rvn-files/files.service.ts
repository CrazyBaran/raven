import { FileData } from '@app/rvns-files';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { FileEntity } from './entities/file.entity';

interface UpdateOptions {
  tagEntities: TagEntity[];
}
type CreateOptions = UpdateOptions;

@Injectable()
export class FilesService {
  public constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  public async create(
    opportunityId: string,
    sharepointId: string,
    options: CreateOptions,
  ): Promise<FileEntity> {
    const fileEntity = new FileEntity();
    fileEntity.internalSharepointId = sharepointId;
    fileEntity.tags = options.tagEntities;
    fileEntity.opportunityId = opportunityId;
    return await this.fileRepository.save(fileEntity);
  }

  public async update(
    fileEntity: FileEntity,
    options: UpdateOptions,
  ): Promise<FileEntity> {
    fileEntity.tags = options.tagEntities;
    return await this.fileRepository.save(fileEntity);
  }

  public fileEntityToFileData(fileEntity: FileEntity): FileData {
    return {
      id: fileEntity.id,
      internalSharepointId: fileEntity.internalSharepointId,
      opportunityId: fileEntity.opportunityId,
      tags: fileEntity.tags.map((tagEntity) => ({
        id: tagEntity.id,
        name: tagEntity.name,
        type: tagEntity.type,
      })),
    };
  }
}
