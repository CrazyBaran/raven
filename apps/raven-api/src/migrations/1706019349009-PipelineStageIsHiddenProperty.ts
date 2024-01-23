import { MigrationInterface, QueryRunner } from 'typeorm';

export class PipelineStageIsHiddenProperty1706019349009
  implements MigrationInterface
{
  public name = 'PipelineStageIsHiddenProperty1706019349009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" ADD "is_hidden" bit NOT NULL CONSTRAINT "DF_dffd61d403ef30b9aba7e749243" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" DROP CONSTRAINT "DF_dffd61d403ef30b9aba7e749243"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" DROP COLUMN "is_hidden"`,
    );
  }
}
