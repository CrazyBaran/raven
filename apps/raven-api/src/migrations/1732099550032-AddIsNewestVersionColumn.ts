import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsNewestVersionColumn1732099550032
  implements MigrationInterface
{
  public name = 'AddIsNewestVersionColumn1732099550032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD "is_newest_version" bit NOT NULL CONSTRAINT "DF_d858bdf38c92612423ab6d72c69" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP COLUMN "is_newest_version"`,
    );
  }
}
