import { MigrationInterface, QueryRunner } from 'typeorm';

export class FundManagersDetails1724735351525 implements MigrationInterface {
  public name = 'FundManagersDetails1724735351525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_fund_manager_organisation" ("fund_manager_id" uniqueidentifier NOT NULL, "organisation_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_3bc9fa9d1b9e69e174149079d46" PRIMARY KEY ("fund_manager_id", "organisation_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3ad875ebbfe17f5d1bbd46852d" ON "rvn_fund_manager_organisation" ("fund_manager_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e67b99ae12e7a25b58394f8647" ON "rvn_fund_manager_organisation" ("organisation_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_fund_manager_key_relationship" ("fund_manager_id" uniqueidentifier NOT NULL, "user_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_6293176a2e7fbea6074df4386e0" PRIMARY KEY ("fund_manager_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a5a722e58e92e465cbd7f16cb7" ON "rvn_fund_manager_key_relationship" ("fund_manager_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c3f77da171b3313237c030368d" ON "rvn_fund_manager_key_relationship" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_fund_manager_industry" ("fund_manager_id" uniqueidentifier NOT NULL, "tag_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_bd30e7a935a07eecfe61b4b2a00" PRIMARY KEY ("fund_manager_id", "tag_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8cb46bff3423514ba8fabb20e8" ON "rvn_fund_manager_industry" ("fund_manager_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c2f814d0b24b2e49b74b29b385" ON "rvn_fund_manager_industry" ("tag_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" ADD "strategy" nvarchar(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" ADD "geography" nvarchar(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" ADD "avg_check_size" nvarchar(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" ADD "relation_strength" nvarchar(60) CONSTRAINT CHK_530af9d0a5e2f3cd2bd31afa96_ENUM CHECK(relation_strength IN ('portfolio','close_partner','network','no-relationship'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_organisation" ADD CONSTRAINT "FK_3ad875ebbfe17f5d1bbd46852d6" FOREIGN KEY ("fund_manager_id") REFERENCES "rvn_fund_manager"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_organisation" ADD CONSTRAINT "FK_e67b99ae12e7a25b58394f8647b" FOREIGN KEY ("organisation_id") REFERENCES "rvn_organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_key_relationship" ADD CONSTRAINT "FK_a5a722e58e92e465cbd7f16cb76" FOREIGN KEY ("fund_manager_id") REFERENCES "rvn_fund_manager"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_key_relationship" ADD CONSTRAINT "FK_c3f77da171b3313237c030368df" FOREIGN KEY ("user_id") REFERENCES "rvn_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_industry" ADD CONSTRAINT "FK_8cb46bff3423514ba8fabb20e82" FOREIGN KEY ("fund_manager_id") REFERENCES "rvn_fund_manager"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_industry" ADD CONSTRAINT "FK_c2f814d0b24b2e49b74b29b3859" FOREIGN KEY ("tag_id") REFERENCES "rvn_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_industry" DROP CONSTRAINT "FK_c2f814d0b24b2e49b74b29b3859"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_industry" DROP CONSTRAINT "FK_8cb46bff3423514ba8fabb20e82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_key_relationship" DROP CONSTRAINT "FK_c3f77da171b3313237c030368df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_key_relationship" DROP CONSTRAINT "FK_a5a722e58e92e465cbd7f16cb76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_organisation" DROP CONSTRAINT "FK_e67b99ae12e7a25b58394f8647b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_organisation" DROP CONSTRAINT "FK_3ad875ebbfe17f5d1bbd46852d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP CONSTRAINT "CHK_530af9d0a5e2f3cd2bd31afa96_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP COLUMN "relation_strength"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP COLUMN "avg_check_size"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP COLUMN "geography"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP COLUMN "strategy"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_c2f814d0b24b2e49b74b29b385" ON "rvn_fund_manager_industry"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_8cb46bff3423514ba8fabb20e8" ON "rvn_fund_manager_industry"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_fund_manager_industry"`);
    await queryRunner.query(
      `DROP INDEX "IDX_c3f77da171b3313237c030368d" ON "rvn_fund_manager_key_relationship"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_a5a722e58e92e465cbd7f16cb7" ON "rvn_fund_manager_key_relationship"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_fund_manager_key_relationship"`);
    await queryRunner.query(
      `DROP INDEX "IDX_e67b99ae12e7a25b58394f8647" ON "rvn_fund_manager_organisation"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3ad875ebbfe17f5d1bbd46852d" ON "rvn_fund_manager_organisation"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_fund_manager_organisation"`);
  }
}
