import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpportunityPreviousPipelineStage1706086586199
  implements MigrationInterface
{
  public name = 'OpportunityPreviousPipelineStage1706086586199';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "previous_pipeline_stage_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD CONSTRAINT "FK_c6c93f9f73b7afa6e49db8eda9b" FOREIGN KEY ("previous_pipeline_stage_id") REFERENCES "rvn_pipeline_stages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "FK_c6c93f9f73b7afa6e49db8eda9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "previous_pipeline_stage_id"`,
    );
  }
}
