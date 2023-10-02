import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEntity } from './entities/template.entity';
import { FieldGroupEntity } from './entities/field-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity, FieldGroupEntity])],
})
export class TemplatesModule {}
