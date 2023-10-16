import {StorageAccountFileEntity} from "./storage-account-file.entity";

export class CreateStorageAccountFileResult {
    public readonly storageAccountFile: StorageAccountFileEntity;
    public readonly sasToken: string;
}
