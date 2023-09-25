import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuditLogs1695282699482 implements MigrationInterface {
  public name = 'AuditLogs1695282699482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_audit_logs" ("id" int NOT NULL IDENTITY(1,1), "user" nvarchar(255) NOT NULL, "module" nvarchar(255) NOT NULL, "action_type" varchar(255) NOT NULL, "action_result" int NOT NULL, "query" nvarchar(2083), "body" nvarchar(MAX), "http_method" varchar(255) NOT NULL, "controller" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_0d7a48d92a31662e596f3097ee3" DEFAULT getdate(), CONSTRAINT "PK_cf72f9d8f44050e4bed019f2681" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0d7a48d92a31662e596f3097ee" ON "rvn_audit_logs" ("created_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_0d7a48d92a31662e596f3097ee" ON "rvn_audit_logs"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_audit_logs"`);
  }
}
