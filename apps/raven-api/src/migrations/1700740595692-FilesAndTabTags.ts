import { MigrationInterface, QueryRunner } from 'typeorm';

export class FilesAndTabTags1700740595692 implements MigrationInterface {
  public name = 'FilesAndTabTags1700740595692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_files" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_aa1939427717bbe5ffead4c9ed4" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "path" nvarchar(255) NOT NULL, "internal_sharepoint_id" nvarchar(255) NOT NULL, "opportunity_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_aa1939427717bbe5ffead4c9ed4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ad74ab825399afa88c0cdc2dbe" ON "rvn_files" ("id", "name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_file_tags" ("file_id" uniqueidentifier NOT NULL, "tag_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_2cefafe2d782ecdd0a7556c02f2" PRIMARY KEY ("file_id", "tag_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3e5a730b19a8afd413570e0222" ON "rvn_file_tags" ("file_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ac072fcbafca48ee8c16b55d04" ON "rvn_file_tags" ("tag_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" ADD "tab_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" ADD CONSTRAINT "FK_e4f34c6bce68530e12a2c15e6f6" FOREIGN KEY ("tab_id") REFERENCES "rvn_tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_files" ADD CONSTRAINT "FK_ed963072b12c8a1a66f11cecf33" FOREIGN KEY ("opportunity_id") REFERENCES "rvn_opportunities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_file_tags" ADD CONSTRAINT "FK_3e5a730b19a8afd413570e02221" FOREIGN KEY ("file_id") REFERENCES "rvn_files"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_file_tags" ADD CONSTRAINT "FK_ac072fcbafca48ee8c16b55d046" FOREIGN KEY ("tag_id") REFERENCES "rvn_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_file_tags" DROP CONSTRAINT "FK_ac072fcbafca48ee8c16b55d046"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_file_tags" DROP CONSTRAINT "FK_3e5a730b19a8afd413570e02221"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_files" DROP CONSTRAINT "FK_ed963072b12c8a1a66f11cecf33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" DROP CONSTRAINT "FK_e4f34c6bce68530e12a2c15e6f6"`,
    );
    await queryRunner.query(`ALTER TABLE "rvn_tags" DROP COLUMN "tab_id"`);
    await queryRunner.query(
      `DROP INDEX "IDX_ac072fcbafca48ee8c16b55d04" ON "rvn_file_tags"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3e5a730b19a8afd413570e0222" ON "rvn_file_tags"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_file_tags"`);
    await queryRunner.query(
      `DROP INDEX "IDX_ad74ab825399afa88c0cdc2dbe" ON "rvn_files"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_files"`);
  }
}
