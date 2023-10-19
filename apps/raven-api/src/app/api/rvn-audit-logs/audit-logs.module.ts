import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogEntity } from './entities/audit-log.entity';
import { AuditLogsLogger } from './loggers/audit-logs.logger';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [AuditLogsService, AuditLogsLogger],
  exports: [AuditLogsService, AuditLogsLogger],
})
export class AuditLogsModule {}
