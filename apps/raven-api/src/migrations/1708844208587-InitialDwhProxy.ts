import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDwhProxy1708844208587 implements MigrationInterface {
  public name = 'InitialDwhProxy1708844208587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_dwh_v1_companies_industries" ("industry_id" uniqueidentifier NOT NULL CONSTRAINT "DF_6cd27608750a098662430b3ea8b" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_6cd27608750a098662430b3ea8b" PRIMARY KEY ("industry_id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_6cd27608750a098662430b3ea8" ON "rvn_dwh_v1_companies_industries" ("industry_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_dwh_v1_companies_investors" ("investor_id" uniqueidentifier NOT NULL CONSTRAINT "DF_01287281d22a7e4c32370327709" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_01287281d22a7e4c32370327709" PRIMARY KEY ("investor_id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_01287281d22a7e4c3237032770" ON "rvn_dwh_v1_companies_investors" ("investor_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_dwh_v1_companies" ("organisation_id" uniqueidentifier NOT NULL, "name" varchar(250), "funding_total_funding_amount" bigint, "funding_last_funding_amount" bigint, "funding_last_funding_date" date, "funding_last_funding_round" varchar(50), "hq_country" varchar(MAX), "mcv_lead_score" float, "data" nvarchar(MAX), "last_refreshed_utc" datetime, "deal_room_last_updated" datetime, "specter_last_updated" date, CONSTRAINT "PK_b667563b8cd0b79cdffc8eed094" PRIMARY KEY ("organisation_id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b667563b8cd0b79cdffc8eed09" ON "rvn_dwh_v1_companies" ("organisation_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_dwh_v1_companies_investors_companies" ("organisation_id" uniqueidentifier NOT NULL, "investor_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_fac427dbadd1c3266fb66208130" PRIMARY KEY ("organisation_id", "investor_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ea7fdfad35ee2d0e706dce8312" ON "rvn_dwh_v1_companies_investors_companies" ("organisation_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c57afc3dd62651d558998bd2d7" ON "rvn_dwh_v1_companies_investors_companies" ("investor_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_dwh_v1_companies_industries_companies" ("organisation_id" uniqueidentifier NOT NULL, "industry_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_e8b9255d84d19df941681ae1e86" PRIMARY KEY ("organisation_id", "industry_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab20eced6c9d749df4629f134d" ON "rvn_dwh_v1_companies_industries_companies" ("organisation_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_31099cf0b2c8550bbac00e3051" ON "rvn_dwh_v1_companies_industries_companies" ("industry_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_dwh_v1_companies" ADD CONSTRAINT "FK_b667563b8cd0b79cdffc8eed094" FOREIGN KEY ("organisation_id") REFERENCES "rvn_organisations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_dwh_v1_companies_investors_companies" ADD CONSTRAINT "FK_ea7fdfad35ee2d0e706dce8312e" FOREIGN KEY ("organisation_id") REFERENCES "rvn_dwh_v1_companies"("organisation_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_dwh_v1_companies_investors_companies" ADD CONSTRAINT "FK_c57afc3dd62651d558998bd2d79" FOREIGN KEY ("investor_id") REFERENCES "rvn_dwh_v1_companies_investors"("investor_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_dwh_v1_companies_industries_companies" ADD CONSTRAINT "FK_ab20eced6c9d749df4629f134dd" FOREIGN KEY ("organisation_id") REFERENCES "rvn_dwh_v1_companies"("organisation_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_dwh_v1_companies_industries_companies" ADD CONSTRAINT "FK_31099cf0b2c8550bbac00e30519" FOREIGN KEY ("industry_id") REFERENCES "rvn_dwh_v1_companies_industries"("industry_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_dwh_v1_companies_industries_companies" DROP CONSTRAINT "FK_31099cf0b2c8550bbac00e30519"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_dwh_v1_companies_industries_companies" DROP CONSTRAINT "FK_ab20eced6c9d749df4629f134dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_dwh_v1_companies_investors_companies" DROP CONSTRAINT "FK_c57afc3dd62651d558998bd2d79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_dwh_v1_companies_investors_companies" DROP CONSTRAINT "FK_ea7fdfad35ee2d0e706dce8312e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_dwh_v1_companies" DROP CONSTRAINT "FK_b667563b8cd0b79cdffc8eed094"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_31099cf0b2c8550bbac00e3051" ON "rvn_dwh_v1_companies_industries_companies"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_ab20eced6c9d749df4629f134d" ON "rvn_dwh_v1_companies_industries_companies"`,
    );
    await queryRunner.query(
      `DROP TABLE "rvn_dwh_v1_companies_industries_companies"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_c57afc3dd62651d558998bd2d7" ON "rvn_dwh_v1_companies_investors_companies"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_ea7fdfad35ee2d0e706dce8312" ON "rvn_dwh_v1_companies_investors_companies"`,
    );
    await queryRunner.query(
      `DROP TABLE "rvn_dwh_v1_companies_investors_companies"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_b667563b8cd0b79cdffc8eed09" ON "rvn_dwh_v1_companies"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_dwh_v1_companies"`);
    await queryRunner.query(
      `DROP INDEX "IDX_01287281d22a7e4c3237032770" ON "rvn_dwh_v1_companies_investors"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_dwh_v1_companies_investors"`);
    await queryRunner.query(
      `DROP INDEX "IDX_6cd27608750a098662430b3ea8" ON "rvn_dwh_v1_companies_industries"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_dwh_v1_companies_industries"`);
  }
}
