import { MigrationInterface, QueryRunner } from 'typeorm';

export class FieldConfiguration1702298514058 implements MigrationInterface {
  public name = 'FieldConfiguration1702298514058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" ADD "configuration" nvarchar(MAX)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" ADD "configuration" nvarchar(MAX)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" DROP COLUMN "configuration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" DROP COLUMN "configuration"`,
    );
  }
}
