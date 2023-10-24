import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { UserRegisteredEventHandler } from './event-handlers/user-registered.event-handler';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  providers: [TagsService, UserRegisteredEventHandler],
  controllers: [TagsController],
})
export class TagsModule {}
