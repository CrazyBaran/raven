import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldDefinitionEntity } from './entities/field-definition.entity';
import { FieldGroupEntity } from './entities/field-group.entity';
import { TabEntity } from './entities/tab.entity';
import { TemplateEntity } from './entities/template.entity';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TemplateEntity,
      TabEntity,
      FieldGroupEntity,
      FieldDefinitionEntity,
    ]),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
