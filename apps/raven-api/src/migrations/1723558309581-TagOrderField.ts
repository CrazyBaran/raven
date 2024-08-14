import { MigrationInterface, QueryRunner } from 'typeorm';

export class TagOrderField1723558309581 implements MigrationInterface {
  public name = 'TagOrderField1723558309581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" ADD "order" smallint NOT NULL CONSTRAINT "DF_2ba744271f13e07258a9f763ae8" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" DROP CONSTRAINT "DF_2ba744271f13e07258a9f763ae8"`,
    );
    await queryRunner.query(`ALTER TABLE "rvn_tags" DROP COLUMN "order"`);
  }
}
