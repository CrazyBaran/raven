import { MigrationInterface, QueryRunner } from 'typeorm';

export class TabRelatedTemplates1700045086019 implements MigrationInterface {
  public name = 'TabRelatedTemplates1700045086019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_tab_related_template" ("tab_id" uniqueidentifier NOT NULL, "template_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_87688af240f192d14416e14cde7" PRIMARY KEY ("tab_id", "template_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_634dbe93abf86fc77c3adccddf" ON "rvn_tab_related_template" ("tab_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b7f0cdfe644a8f92ff17153c90" ON "rvn_tab_related_template" ("template_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_related_template" ADD CONSTRAINT "FK_634dbe93abf86fc77c3adccddfe" FOREIGN KEY ("tab_id") REFERENCES "rvn_tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_related_template" ADD CONSTRAINT "FK_b7f0cdfe644a8f92ff17153c903" FOREIGN KEY ("template_id") REFERENCES "rvn_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_related_template" DROP CONSTRAINT "FK_b7f0cdfe644a8f92ff17153c903"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_related_template" DROP CONSTRAINT "FK_634dbe93abf86fc77c3adccddfe"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_b7f0cdfe644a8f92ff17153c90" ON "rvn_tab_related_template"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_634dbe93abf86fc77c3adccddf" ON "rvn_tab_related_template"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_tab_related_template"`);
  }
}
