import { MigrationInterface, QueryRunner } from 'typeorm';

export class PipelineStageIsDefault1707477914664 implements MigrationInterface {
  public name = 'PipelineStageIsDefault1707477914664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" ADD "is_default" bit NOT NULL CONSTRAINT "DF_069370745b86976b78e079944d1" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" DROP CONSTRAINT "DF_069370745b86976b78e079944d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" DROP COLUMN "is_default"`,
    );
  }
}
