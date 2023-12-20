import { MigrationInterface, QueryRunner } from 'typeorm';

export class FieldHideOnPipelineStages1703073272022
  implements MigrationInterface
{
  public name = 'FieldHideOnPipelineStages1703073272022';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_field_hide_pipeline_stage" ("field_id" uniqueidentifier NOT NULL, "pipeline_stage_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_9bc64efafbd31e4d8db45e41d71" PRIMARY KEY ("field_id", "pipeline_stage_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_845f5b65947dc6be3bad6c5150" ON "rvn_field_hide_pipeline_stage" ("field_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_83f2889e605a46e5e281ce5eb0" ON "rvn_field_hide_pipeline_stage" ("pipeline_stage_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_hide_pipeline_stage" ADD CONSTRAINT "FK_845f5b65947dc6be3bad6c51505" FOREIGN KEY ("field_id") REFERENCES "rvn_field_definitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_hide_pipeline_stage" ADD CONSTRAINT "FK_83f2889e605a46e5e281ce5eb04" FOREIGN KEY ("pipeline_stage_id") REFERENCES "rvn_pipeline_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_field_hide_pipeline_stage" DROP CONSTRAINT "FK_83f2889e605a46e5e281ce5eb04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_hide_pipeline_stage" DROP CONSTRAINT "FK_845f5b65947dc6be3bad6c51505"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_83f2889e605a46e5e281ce5eb0" ON "rvn_field_hide_pipeline_stage"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_845f5b65947dc6be3bad6c5150" ON "rvn_field_hide_pipeline_stage"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_field_hide_pipeline_stage"`);
  }
}
