import { MigrationInterface, QueryRunner } from 'typeorm';

export class PipelineRelationship1696577713029 implements MigrationInterface {
  public name = 'PipelineRelationship1696577713029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" ADD "order" int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "pipeline_stage_id" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD CONSTRAINT "FK_fd3f37a1e82ffe337ee6601218b" FOREIGN KEY ("pipeline_stage_id") REFERENCES "rvn_pipeline_stages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "FK_fd3f37a1e82ffe337ee6601218b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "pipeline_stage_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" DROP COLUMN "order"`,
    );
  }
}
