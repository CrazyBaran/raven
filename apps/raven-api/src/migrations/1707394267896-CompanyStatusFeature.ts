import { MigrationInterface, QueryRunner } from 'typeorm';

export class CompanyStatusFeature1707394267896 implements MigrationInterface {
  public name = 'CompanyStatusFeature1707394267896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" ADD "related_company_status" nvarchar(30) CONSTRAINT CHK_c4ae60ded46f72a67bdd9230a2_ENUM CHECK(related_company_status IN ('outreach','met','live_opportunity','portfolio','passed'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" ADD "company_status_override" nvarchar(30) CONSTRAINT CHK_dfa59ae0ba6d6b7b596faadfb6_ENUM CHECK(company_status_override IN ('outreach','met','live_opportunity','portfolio','passed'))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" DROP COLUMN "company_status_override"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" DROP COLUMN "related_company_status"`,
    );
  }
}
