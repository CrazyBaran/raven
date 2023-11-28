import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnBehalfOfModule } from '../rvn-on-behalf-of/on-behalf-of.module';
import { FileEntity } from './entities/file.entity';
import { FilesService } from './files.service';
import { SharePointService } from './share-point.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    HttpModule,
    OnBehalfOfModule,
  ],
  controllers: [],
  providers: [FilesService, SharePointService],
  exports: [FilesService],
})
export class FilesModule {}
