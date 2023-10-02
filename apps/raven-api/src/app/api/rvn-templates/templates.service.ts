import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TemplateEntity } from './entities/template.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplateData } from '@app/rvns-templates';

@Injectable()
export class TemplatesService {
  public constructor(
    private readonly templatesRepository: Repository<TemplateEntity>,
  ) {}

  public async list(): Promise<TemplateEntity[]> {
    return this.templatesRepository.find();
  }

  public async create(name: string, authorId: string): Promise<TemplateEntity> {
    const templateEntity = new TemplateEntity();
    templateEntity.name = name;
    templateEntity.createdBy = { id: authorId } as UserEntity;
    return this.templatesRepository.save(templateEntity);
  }

  public async update(
    templateEntity: TemplateEntity,
    dto: UpdateTemplateDto,
  ): Promise<TemplateEntity> {
    templateEntity.name = dto.name;
    return this.templatesRepository.save(templateEntity);
  }

  public templateEntityToTemplateData(entity: TemplateEntity): TemplateData {
    return {
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdById: entity.createdById,
    };
  }

  public templateEntitiesToTemplateData(
    entities: TemplateEntity[],
  ): TemplateData[] {
    return entities.map((e) => this.templateEntityToTemplateData(e));
  }
}
