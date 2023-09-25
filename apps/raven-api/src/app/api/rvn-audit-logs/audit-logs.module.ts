import { AuditLogsService } from './audit-logs.service';
import { AuditLogEntity } from './entities/audit-log.entity';
import { AuditLogsLogger } from './loggers/audit-logs.logger';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [AuditLogsService, AuditLogsLogger],
  exports: [AuditLogsService, AuditLogsLogger],
})
export class AuditLogsModule {}
