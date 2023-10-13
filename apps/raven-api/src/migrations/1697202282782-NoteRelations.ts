import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoteRelations1697202282782 implements MigrationInterface {
  public name = 'NoteRelations1697202282782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP CONSTRAINT "FK_ab81999da30ba7e4a70660dad4c"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_ab81999da30ba7e4a70660dad4" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_bc7cbe8e92ce3c65e71747681e" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sql-uks-mc-raven-dev-db-01.dbo.rvn_notes" DROP COLUMN "opportunity_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sql-uks-mc-raven-dev-db-01.dbo.rvn_notes" ADD "template_id" uniqueidentifier`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_6c23d90017dcbe0abe4321c1ea" ON "rvn_notes" ("template_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_9a4441f77e4a2b20f79fc553c0" ON "rvn_notes" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD CONSTRAINT "FK_6c23d90017dcbe0abe4321c1eae" FOREIGN KEY ("template_id") REFERENCES "rvn_templates"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP CONSTRAINT "FK_6c23d90017dcbe0abe4321c1eae"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_9a4441f77e4a2b20f79fc553c0" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_6c23d90017dcbe0abe4321c1ea" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sql-uks-mc-raven-dev-db-01.dbo.rvn_notes" DROP COLUMN "template_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sql-uks-mc-raven-dev-db-01.dbo.rvn_notes" ADD "opportunity_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bc7cbe8e92ce3c65e71747681e" ON "rvn_notes" ("id", "opportunity_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab81999da30ba7e4a70660dad4" ON "rvn_notes" ("opportunity_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD CONSTRAINT "FK_ab81999da30ba7e4a70660dad4c" FOREIGN KEY ("opportunity_id") REFERENCES "rvn_opportunities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
