import { FileData } from '@app/rvns-files';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '../rvn-tags/entities/tag.entity';
import { FileEntity } from './entities/file.entity';
import { SharePointService } from './share-point.service';

interface UpdateOptions {
  tagEntities: TagEntity[];
}
type CreateOptions = UpdateOptions;

@Injectable()
export class FilesService {
  public constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly sharePointService: SharePointService,
  ) {}

  public async create(
    opportunityId: string,
    sharepointId: string,
    options: CreateOptions,
  ): Promise<FileEntity> {
    const { name, path } =
      await this.sharePointService.getFileDetails(sharepointId);

    if (!name || !path) {
      throw new Error('File not found');
    }

    const fileEntity = new FileEntity();
    fileEntity.internalSharepointId = sharepointId;
    fileEntity.tags = options.tagEntities;
    fileEntity.opportunityId = opportunityId;
    fileEntity.name = name;
    fileEntity.path = path;
    return await this.fileRepository.save(fileEntity);
  }

  public async update(
    fileEntity: FileEntity,
    options: UpdateOptions,
  ): Promise<FileEntity> {
    fileEntity.tags = options.tagEntities;
    return await this.fileRepository.save(fileEntity);
  }

  public async findAllForOpportunity(
    opportunityId: string,
  ): Promise<FileEntity[]> {
    return await this.fileRepository.find({
      where: { opportunityId },
      relations: ['tags'],
    });
  }

  public fileEntityToFileData(fileEntity: FileEntity): FileData {
    return {
      id: fileEntity.id,
      name: fileEntity.name,
      path: fileEntity.path,
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
