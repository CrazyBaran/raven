import { NoteAttachmentData } from '@app/rvns-notes/data-access';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStorageAccountFileResult } from './entities/create-storage-account-file.result';
import { StorageAccountFileEntity } from './entities/storage-account-file.entity';
import { StorageAccountClient } from './storage-account.client';

@Injectable()
export class StorageAccountService {
  public constructor(
    private readonly storageAccountClient: StorageAccountClient,
    @InjectRepository(StorageAccountFileEntity)
    private readonly storageAccountFileRepository: Repository<StorageAccountFileEntity>,
  ) {}

  public async createStorageAccountFile(
    containerName: string,
    fileName: string,
    noteRootVersionId: string,
    createdById: string,
  ): Promise<CreateStorageAccountFileResult> {
    const storageAccountFile = new StorageAccountFileEntity();

    storageAccountFile.originalFileName = fileName;
    storageAccountFile.noteRootVersionId = noteRootVersionId;
    storageAccountFile.createdById = createdById;

    const savedEntity =
      await this.storageAccountFileRepository.save(storageAccountFile);

    const sasToken = await this.storageAccountClient.generateSASUrl(
      containerName,
      savedEntity.fileName,
      { create: true },
      600,
    );

    return {
      storageAccountFile: savedEntity,
      sasToken: sasToken,
    };
  }

  public async getSasTokenForFile(
    containerName: string,
    fileName: string,
  ): Promise<string> {
    return await this.storageAccountClient.generateSASUrl(
      containerName,
      fileName,
      { read: true },
      600,
    );
  }

  public async getStorageAccountFiles(
    rootVersionId: string,
  ): Promise<NoteAttachmentData[]> {
    const storageAccountFiles = await this.storageAccountFileRepository.find({
      where: { noteRootVersionId: rootVersionId },
    });

    const attachments: NoteAttachmentData[] = [];
    for (const file of storageAccountFiles) {
      attachments.push({
        fileName: file.fileName,
        url: await this.getSasTokenForFile('default', file.fileName),
      } as NoteAttachmentData);
    }

    return attachments;
  }
}
