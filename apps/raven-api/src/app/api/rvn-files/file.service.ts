import { Injectable } from '@nestjs/common';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FileService {
  public update(id: number, updateFileDto: UpdateFileDto): string {
    return `This action updates a #${id} file`;
  }
}
