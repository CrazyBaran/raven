import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultTemplate1698060810915 implements MigrationInterface {
  public name = 'DefaultTemplate1698060810915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" ADD "is_default" bit NOT NULL CONSTRAINT "DF_316e090b26351563318643a8f37" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" DROP COLUMN "is_default"`,
    );
  }
}
