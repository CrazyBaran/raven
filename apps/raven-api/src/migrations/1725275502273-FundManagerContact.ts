import { MigrationInterface, QueryRunner } from 'typeorm';

export class FundManagerContact1725275502273 implements MigrationInterface {
  public name = 'FundManagerContact1725275502273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_fund_manager_contact" ("name" nvarchar(256) NOT NULL, "position" nvarchar(256) NOT NULL, "relation_strength" nvarchar(60) CONSTRAINT CHK_c3acc3226bf005eb5faf591457_ENUM CHECK(relation_strength IN ('$','$$','$$$')), "email" nvarchar(512) NOT NULL, "linkedin" nvarchar(512) NOT NULL, "fund_manager_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_84a7200bf286e6a794cd0cc30f1" PRIMARY KEY ("fund_manager_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" ADD CONSTRAINT "FK_84a7200bf286e6a794cd0cc30f1" FOREIGN KEY ("fund_manager_id") REFERENCES "rvn_fund_manager"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" DROP CONSTRAINT "FK_84a7200bf286e6a794cd0cc30f1"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_fund_manager_contact"`);
  }
}
