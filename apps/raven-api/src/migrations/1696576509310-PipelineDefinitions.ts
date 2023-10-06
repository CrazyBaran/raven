import { MigrationInterface, QueryRunner } from 'typeorm';

export class PipelineDefinitions1696576509310 implements MigrationInterface {
  public name = 'PipelineDefinitions1696576509310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "FK_6194e07c23b849fdaef2763ea3c"`,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_pipeline_definitions" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_d8f3d7bcca95f68d0668cfdee32" DEFAULT NEWSEQUENTIALID(), CONSTRAINT "PK_d8f3d7bcca95f68d0668cfdee32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d8f3d7bcca95f68d0668cfdee3" ON "rvn_pipeline_definitions" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_pipeline_stages" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_b6fa3f566faad372719dd028e4b" DEFAULT NEWSEQUENTIALID(), "pipeline_definition_id" uniqueidentifier NOT NULL, "display_name" nvarchar(255) NOT NULL, "mapped_from" nvarchar(255) NOT NULL, CONSTRAINT "PK_b6fa3f566faad372719dd028e4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b6fa3f566faad372719dd028e4" ON "rvn_pipeline_stages" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "pipeline_definition_id" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "organisation_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "organisation_id" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD CONSTRAINT "FK_edb7a5ee96de9c42e7341d67026" FOREIGN KEY ("organisation_id") REFERENCES "rvn_organisations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD CONSTRAINT "FK_874609f835593c95675cbe22aef" FOREIGN KEY ("pipeline_definition_id") REFERENCES "rvn_pipeline_definitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" ADD CONSTRAINT "FK_cc194b75a8412013552d8350452" FOREIGN KEY ("pipeline_definition_id") REFERENCES "rvn_pipeline_definitions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_pipeline_stages" DROP CONSTRAINT "FK_cc194b75a8412013552d8350452"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "FK_874609f835593c95675cbe22aef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "FK_edb7a5ee96de9c42e7341d67026"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "organisation_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "organisation_id" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "pipeline_definition_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_b6fa3f566faad372719dd028e4" ON "rvn_pipeline_stages"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_pipeline_stages"`);
    await queryRunner.query(
      `DROP INDEX "IDX_d8f3d7bcca95f68d0668cfdee3" ON "rvn_pipeline_definitions"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_pipeline_definitions"`);
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD CONSTRAINT "FK_6194e07c23b849fdaef2763ea3c" FOREIGN KEY ("id") REFERENCES "rvn_organisations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
