import { Repository } from 'typeorm';

import { AuditLogEntity } from './entities/audit-log.entity';
import { ActionTypeEnum } from './enums/action-type.enum';
import { AuditLog } from './interfaces/audit-log.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuditLogsService {
  private methodToActionMap: Record<string, ActionTypeEnum> = {
    GET: ActionTypeEnum.Access,
    POST: ActionTypeEnum.Post,
    PUT: ActionTypeEnum.Update,
    PATCH: ActionTypeEnum.Update,
    DELETE: ActionTypeEnum.Delete,
  };

  public constructor(
    @InjectRepository(AuditLogEntity)
    private logsRepository: Repository<AuditLogEntity>,
  ) {}

  public async create(auditLog: AuditLog): Promise<AuditLogEntity> {
    const auditLogEntity = new AuditLogEntity();
    auditLogEntity.user = auditLog.user;
    auditLogEntity.module = auditLog.module;
    auditLogEntity.actionType = auditLog.actionType;
    auditLogEntity.actionResult = auditLog.actionResult;
    auditLogEntity.query = auditLog.query;
    auditLogEntity.body = auditLog.body;
    auditLogEntity.httpMethod = auditLog.httpMethod;
    auditLogEntity.controller = auditLog.controller;

    return this.logsRepository.save(auditLogEntity);
  }

  public getActionEnum(method: string): ActionTypeEnum {
    return this.methodToActionMap[method];
  }
}
