import { MigrationInterface, QueryRunner } from 'typeorm';

export class PipelineStageShowFields1705583353355
  implements MigrationInterface
{
  public name = 'PipelineStageShowFields1705583353355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" ADD "show_fields" ntext`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" DROP COLUMN "show_fields"`,
    );
  }
}
