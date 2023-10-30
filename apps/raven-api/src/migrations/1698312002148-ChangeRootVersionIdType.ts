import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRootVersionIdType1698312002148
  implements MigrationInterface
{
  public name = 'ChangeRootVersionIdType1698312002148';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_ca6c3778dbbed393aa909f5f94" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP CONSTRAINT "DF_ca6c3778dbbed393aa909f5f94c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ALTER COLUMN "root_version_id" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD CONSTRAINT "DF_ca6c3778dbbed393aa909f5f94c" DEFAULT newid() FOR "root_version_id"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca6c3778dbbed393aa909f5f94" ON "rvn_notes" ("root_version_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_ca6c3778dbbed393aa909f5f94" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP CONSTRAINT "DF_ca6c3778dbbed393aa909f5f94c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ALTER COLUMN "root_version_id" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD CONSTRAINT "DF_ca6c3778dbbed393aa909f5f94c" DEFAULT newid() FOR "root_version_id"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca6c3778dbbed393aa909f5f94" ON "rvn_notes" ("root_version_id") `,
    );
  }
}
