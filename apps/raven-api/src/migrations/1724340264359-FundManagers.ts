import { MigrationInterface, QueryRunner } from 'typeorm';

export class FundManagers1724340264359 implements MigrationInterface {
  public name = 'FundManagers1724340264359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_fund_manager" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_bc8e80e3480ed0ebb55dab3f066" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(256) NOT NULL, "description" nvarchar(1000), "created_at" datetime2 NOT NULL CONSTRAINT "DF_9edd77578764d76b79056f9e2c2" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_2dda61e31e303ef2975f723c435" DEFAULT getdate(), CONSTRAINT "PK_bc8e80e3480ed0ebb55dab3f066" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bc8e80e3480ed0ebb55dab3f06" ON "rvn_fund_manager" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" ADD "fund_manager_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_3fb512918424c8f454055d20fb" ON "rvn_organisations" ("fund_manager_id") WHERE "fund_manager_id" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" ADD CONSTRAINT "FK_3fb512918424c8f454055d20fbe" FOREIGN KEY ("fund_manager_id") REFERENCES "rvn_fund_manager"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" DROP CONSTRAINT "FK_3fb512918424c8f454055d20fbe"`,
    );
    await queryRunner.query(
      `DROP INDEX "REL_3fb512918424c8f454055d20fb" ON "rvn_organisations"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" DROP COLUMN "fund_manager_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_bc8e80e3480ed0ebb55dab3f06" ON "rvn_fund_manager"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_fund_manager"`);
  }
}
