import { MigrationInterface, QueryRunner } from 'typeorm';

export class PipelineDefinitionAffinityColumns1701781998093
  implements MigrationInterface
{
  public name = 'PipelineDefinitionAffinityColumns1701781998093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_definitions" ADD "affinity_list_id" int`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_definitions" ADD "affinity_status_field_id" int`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_definitions" DROP COLUMN "affinity_status_field_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_definitions" DROP COLUMN "affinity_list_id"`,
    );
  }
}
