import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpportunityShare1701187588000 implements MigrationInterface {
  public name = 'OpportunityShare1701187588000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_shares_opportunities" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_3203fc2b23d6f65ef4aca848e8b" DEFAULT NEWSEQUENTIALID(), "role" varchar(255) NOT NULL, "actor_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_f76d5678d0b29bf4c715df334fd" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_e4bb2e4f3006059148b0bab6bb8" DEFAULT getdate(), "resource_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_3203fc2b23d6f65ef4aca848e8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3155138c3b306dc7cf01af0895" ON "rvn_shares_opportunities" ("actor_id", "resource_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6e2de630c806ef7f3a632169a7" ON "rvn_shares_opportunities" ("resource_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fbb49a860e0dd0bd2c2817345d" ON "rvn_shares_opportunities" ("actor_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shares_opportunities" ADD CONSTRAINT "FK_fbb49a860e0dd0bd2c2817345dd" FOREIGN KEY ("actor_id") REFERENCES "rvn_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shares_opportunities" ADD CONSTRAINT "FK_6e2de630c806ef7f3a632169a77" FOREIGN KEY ("resource_id") REFERENCES "rvn_opportunities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_shares_opportunities" DROP CONSTRAINT "FK_6e2de630c806ef7f3a632169a77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shares_opportunities" DROP CONSTRAINT "FK_fbb49a860e0dd0bd2c2817345dd"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_fbb49a860e0dd0bd2c2817345d" ON "rvn_shares_opportunities"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_6e2de630c806ef7f3a632169a7" ON "rvn_shares_opportunities"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3155138c3b306dc7cf01af0895" ON "rvn_shares_opportunities"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_shares_opportunities"`);
  }
}
