import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpMethodEnum } from '../../shared/enum/http-method.enum';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogEntity } from './entities/audit-log.entity';
import { ActionTypeEnum } from './enums/action-type.enum';
import { AuditLog } from './interfaces/audit-log.interface';

describe('AuditLogsService', () => {
  let service: AuditLogsService;
  let repository: Repository<AuditLogEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogsService,
        {
          provide: getRepositoryToken(AuditLogEntity),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuditLogsService>(AuditLogsService);
    repository = module.get(getRepositoryToken(AuditLogEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create audit log and return new record', async () => {
      const auditLog: AuditLog = {
        user: 'test@test.io',
        module: 'test',
        actionType: ActionTypeEnum.Access,
        actionResult: 200,
        query: null,
        body: null,
        httpMethod: HttpMethodEnum.GET,
        controller: 'test',
      };
      const logMock = jest.genMockFromModule<AuditLogEntity>(
        './entities/audit-log.entity',
      );

      jest.spyOn(repository, 'save').mockResolvedValue(logMock);

      const result = await service.create(auditLog);

      expect(result).toBe(logMock);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenNthCalledWith(1, auditLog);
    });
  });
});
