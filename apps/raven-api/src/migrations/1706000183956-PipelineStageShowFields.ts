import { MigrationInterface, QueryRunner } from 'typeorm';

export class PipelineStageShowFields1706000183956
  implements MigrationInterface
{
  public name = 'PipelineStageShowFields1706000183956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" ADD "show_fields" nvarchar(MAX)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" DROP COLUMN "show_fields"`,
    );
  }
}
