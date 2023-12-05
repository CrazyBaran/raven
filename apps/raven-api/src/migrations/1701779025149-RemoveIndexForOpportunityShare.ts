import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveIndexForOpportunityShare1701779025149
  implements MigrationInterface
{
  public name = 'RemoveIndexForOpportunityShare1701779025149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_fbb49a860e0dd0bd2c2817345d" ON "rvn_shares_opportunities"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fbb49a860e0dd0bd2c2817345d" ON "rvn_shares_opportunities" ("actor_id") `,
    );
  }
}
