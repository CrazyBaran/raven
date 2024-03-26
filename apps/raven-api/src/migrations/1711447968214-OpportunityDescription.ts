import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpportunityDescription1711447968214 implements MigrationInterface {
  public name = 'OpportunityDescription1711447968214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "description" nvarchar(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "description"`,
    );
  }
}
