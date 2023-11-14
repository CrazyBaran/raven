import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpportunityWorkflowNote1699877976010
  implements MigrationInterface
{
  public name = 'OpportunityWorkflowNote1699877976010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "note_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_5b4af11dfc0ec6f8f0433ef28c" ON "rvn_opportunities" ("note_id") WHERE "note_id" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD CONSTRAINT "FK_5b4af11dfc0ec6f8f0433ef28cc" FOREIGN KEY ("note_id") REFERENCES "rvn_notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "FK_5b4af11dfc0ec6f8f0433ef28cc"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_5b4af11dfc0ec6f8f0433ef28c" ON "rvn_opportunities"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "note_id"`,
    );
  }
}
