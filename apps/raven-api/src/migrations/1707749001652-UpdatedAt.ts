import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedAt1707749001652 implements MigrationInterface {
  public name = 'UpdatedAt1707749001652';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "updated_at" datetime2 NOT NULL CONSTRAINT "DF_300c35e4cb053473e3d246c4ff1" DEFAULT getdate()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "DF_300c35e4cb053473e3d246c4ff1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "updated_at"`,
    );
  }
}
