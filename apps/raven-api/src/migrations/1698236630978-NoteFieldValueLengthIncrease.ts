import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoteFieldValueLengthIncrease1698236630978
  implements MigrationInterface
{
  public name = 'NoteFieldValueLengthIncrease1698236630978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_ca6c3778dbbed393aa909f5f94" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" DROP COLUMN "value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" ADD "value" nvarchar(MAX)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" DROP COLUMN "value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" ADD "value" nvarchar(255)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca6c3778dbbed393aa909f5f94" ON "rvn_notes" ("root_version_id") `,
    );
  }
}
