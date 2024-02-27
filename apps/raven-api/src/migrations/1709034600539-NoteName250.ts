import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoteName2501709034600539 implements MigrationInterface {
  public name = 'NoteName2501709034600539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ALTER COLUMN name nvarchar(250) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ALTER COLUMN name nvarchar(50) NOT NULL`,
    );
  }
}
