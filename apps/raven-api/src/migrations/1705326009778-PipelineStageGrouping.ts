import { MigrationInterface, QueryRunner } from 'typeorm';

export class PipelineStageGrouping1705326009778 implements MigrationInterface {
  public name = 'PipelineStageGrouping1705326009778';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_pipeline_groups" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_635585e8e760a0d128e6a796cb8" DEFAULT NEWSEQUENTIALID(), "group_name" nvarchar(255) NOT NULL, CONSTRAINT "PK_635585e8e760a0d128e6a796cb8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_pipeline_stage_groups" ("pipeline_stage_group_id" uniqueidentifier NOT NULL, "pipeline_stage_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_a4e2b8b40f842d9067a7b9f61f2" PRIMARY KEY ("pipeline_stage_group_id", "pipeline_stage_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_51b306a9de10680b2fc07b0185" ON "rvn_pipeline_stage_groups" ("pipeline_stage_group_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9f12248828a2d62902b699d20e" ON "rvn_pipeline_stage_groups" ("pipeline_stage_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stage_groups" ADD CONSTRAINT "FK_51b306a9de10680b2fc07b01852" FOREIGN KEY ("pipeline_stage_group_id") REFERENCES "rvn_pipeline_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stage_groups" ADD CONSTRAINT "FK_9f12248828a2d62902b699d20e1" FOREIGN KEY ("pipeline_stage_id") REFERENCES "rvn_pipeline_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stage_groups" DROP CONSTRAINT "FK_9f12248828a2d62902b699d20e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stage_groups" DROP CONSTRAINT "FK_51b306a9de10680b2fc07b01852"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_9f12248828a2d62902b699d20e" ON "rvn_pipeline_stage_groups"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_51b306a9de10680b2fc07b0185" ON "rvn_pipeline_stage_groups"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_pipeline_stage_groups"`);
    await queryRunner.query(`DROP TABLE "rvn_pipeline_groups"`);
  }
}
