import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemindersSoftDelete1709893750843 implements MigrationInterface {
  public name = 'RemindersSoftDelete1709893750843';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder" ADD "deleted_at" datetime2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder" DROP COLUMN "deleted_at"`,
    );
  }
}
