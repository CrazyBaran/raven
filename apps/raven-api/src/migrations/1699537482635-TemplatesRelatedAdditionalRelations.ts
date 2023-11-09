import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplatesRelatedAdditionalRelations1699537482635
  implements MigrationInterface
{
  public name = 'TemplatesRelatedAdditionalRelations1699537482635';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_tab_pipeline_stage" ("tab_id" uniqueidentifier NOT NULL, "pipeline_stage_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_b39657ce6c2b202eab6ccf4dd5d" PRIMARY KEY ("tab_id", "pipeline_stage_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e7d4591ea795a6d4cc4d537509" ON "rvn_tab_pipeline_stage" ("tab_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3e434f193b683d003b6358b74d" ON "rvn_tab_pipeline_stage" ("pipeline_stage_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_tab_related_field" ("tab_id" uniqueidentifier NOT NULL, "field_definition_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_2a0dded8c437696ce47b988a25e" PRIMARY KEY ("tab_id", "field_definition_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_07a26ae079ee93ef15d921e681" ON "rvn_tab_related_field" ("tab_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aa2964a7cce55872323548668d" ON "rvn_tab_related_field" ("field_definition_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" ADD "template_field_id" uniqueidentifier NOT NULL CONSTRAINT "DF_5d281c92a3e1d65db85a13f5cef" DEFAULT NEWID()`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d281c92a3e1d65db85a13f5ce" ON "rvn_note_fields" ("template_field_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_pipeline_stage" ADD CONSTRAINT "FK_e7d4591ea795a6d4cc4d537509b" FOREIGN KEY ("tab_id") REFERENCES "rvn_tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_pipeline_stage" ADD CONSTRAINT "FK_3e434f193b683d003b6358b74d7" FOREIGN KEY ("pipeline_stage_id") REFERENCES "rvn_pipeline_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_related_field" ADD CONSTRAINT "FK_07a26ae079ee93ef15d921e681d" FOREIGN KEY ("tab_id") REFERENCES "rvn_tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_related_field" ADD CONSTRAINT "FK_aa2964a7cce55872323548668d4" FOREIGN KEY ("field_definition_id") REFERENCES "rvn_field_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_related_field" DROP CONSTRAINT "FK_aa2964a7cce55872323548668d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_related_field" DROP CONSTRAINT "FK_07a26ae079ee93ef15d921e681d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_pipeline_stage" DROP CONSTRAINT "FK_3e434f193b683d003b6358b74d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tab_pipeline_stage" DROP CONSTRAINT "FK_e7d4591ea795a6d4cc4d537509b"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_5d281c92a3e1d65db85a13f5ce" ON "rvn_note_fields"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" DROP CONSTRAINT "DF_5d281c92a3e1d65db85a13f5cef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" DROP COLUMN "template_field_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_aa2964a7cce55872323548668d" ON "rvn_tab_related_field"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_07a26ae079ee93ef15d921e681" ON "rvn_tab_related_field"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_tab_related_field"`);
    await queryRunner.query(
      `DROP INDEX "IDX_3e434f193b683d003b6358b74d" ON "rvn_tab_pipeline_stage"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_e7d4591ea795a6d4cc4d537509" ON "rvn_tab_pipeline_stage"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_tab_pipeline_stage"`);
  }
}
