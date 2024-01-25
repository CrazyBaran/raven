import { MigrationInterface, QueryRunner } from 'typeorm';

export class DomainsTable1706182011141 implements MigrationInterface {
  public name = 'DomainsTable1706182011141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_organisation_domains" ("organisation_id" uniqueidentifier NOT NULL, "domain" nvarchar(255) NOT NULL, CONSTRAINT "PK_f313ece6617aba781d7e4c1f527" PRIMARY KEY ("organisation_id", "domain"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f313ece6617aba781d7e4c1f52" ON "rvn_organisation_domains" ("organisation_id", "domain") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_organisation_domains" ADD CONSTRAINT "FK_af2ca3f4bc964c5499b9ecfbd56" FOREIGN KEY ("organisation_id") REFERENCES "rvn_organisations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisation_domains" DROP CONSTRAINT "FK_af2ca3f4bc964c5499b9ecfbd56"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f313ece6617aba781d7e4c1f52" ON "rvn_organisation_domains"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_organisation_domains"`);
  }
}
