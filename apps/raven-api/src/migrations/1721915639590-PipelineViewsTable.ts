import { MigrationInterface, QueryRunner } from 'typeorm';

export class PipelineViewsTable1721915639590 implements MigrationInterface {
  public name = 'PipelineViewsTable1721915639590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_pipeline_views" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_ff391c6e6ed273a471150d6427b" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "order" smallint NOT NULL, "columns_config" nvarchar(MAX) NOT NULL, "pipeline_definition_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_ff391c6e6ed273a471150d6427b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_views" ADD CONSTRAINT "FK_a354c54f63d819cc128c5972bcd" FOREIGN KEY ("pipeline_definition_id") REFERENCES "rvn_pipeline_definitions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_views" DROP CONSTRAINT "FK_a354c54f63d819cc128c5972bcd"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_pipeline_views"`);
  }
}
