import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoteRootVersionId1697693905789 implements MigrationInterface {
  public name = 'NoteRootVersionId1697693905789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD "root_version_id" nvarchar(255) NOT NULL CONSTRAINT "DF_ca6c3778dbbed393aa909f5f94c" DEFAULT NEWID()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP CONSTRAINT "DF_ca6c3778dbbed393aa909f5f94c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP COLUMN "root_version_id"`,
    );
  }
}
