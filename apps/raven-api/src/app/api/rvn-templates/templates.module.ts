import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEntity } from './entities/template.entity';
import { FieldGroupEntity } from './entities/field-group.entity';
import { TemplatesController } from './templates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity, FieldGroupEntity])],
  controllers: [TemplatesController],
})
export class TemplatesModule {}
