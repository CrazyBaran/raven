import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileService } from './file.service';

@ApiOAuth2(['openid'])
@ApiTags('Files')
@Controller('file')
export class FileController {
  public constructor(private readonly fileService: FileService) {}

  @Get()
  public findAll(): void {
    console.log('temp');
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto,
  ): void {
    console.log('temp');
  }
}
