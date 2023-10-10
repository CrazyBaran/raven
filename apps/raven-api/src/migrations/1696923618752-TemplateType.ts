import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplateType1696923618752 implements MigrationInterface {
  public name = 'TemplateType1696923618752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" ADD "type" nvarchar(50) NOT NULL CONSTRAINT "DF_e39f35515b75ec9a468187b047c" DEFAULT 'note'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" DROP CONSTRAINT "DF_e39f35515b75ec9a468187b047c"`,
    );
    await queryRunner.query(`ALTER TABLE "rvn_templates" DROP COLUMN "type"`);
  }
}
