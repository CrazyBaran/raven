import { MigrationInterface, QueryRunner } from 'typeorm';

export class PipelineStageConfiguration1705499781747
  implements MigrationInterface
{
  public name = 'PipelineStageConfiguration1705499781747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" ADD "configuration" nvarchar(MAX)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" DROP COLUMN "configuration"`,
    );
  }
}
