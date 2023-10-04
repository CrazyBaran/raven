import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';
import { TemplateEntity } from './entities/template.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FieldGroupEntity } from './entities/field-group.entity';
import { FieldDefinitionEntity } from './entities/field-definition.entity';

describe('TemplatesService', () => {
  let service: TemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: getRepositoryToken(TemplateEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(FieldGroupEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(FieldDefinitionEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
