import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpportunityExtraTextFields1723526926428
  implements MigrationInterface
{
  public name = 'OpportunityExtraTextFields1723526926428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "co_investors" nvarchar(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "capital_raise_history" nvarchar(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "capital_raise_history"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "co_investors"`,
    );
  }
}
