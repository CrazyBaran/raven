import { MigrationInterface, QueryRunner } from 'typeorm';

export class PipelineViewsExtend1723204364019 implements MigrationInterface {
  public name = 'PipelineViewsExtend1723204364019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_views" ADD "icon" nvarchar(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_views" ADD "is_default" bit NOT NULL CONSTRAINT "DF_1ec852d6af5676c7e90f5d8db82" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_views" DROP CONSTRAINT "DF_1ec852d6af5676c7e90f5d8db82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_views" DROP COLUMN "is_default"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_views" DROP COLUMN "icon"`,
    );
  }
}
