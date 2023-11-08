import { MigrationInterface, QueryRunner } from "typeorm";

export class TemplateMapping1699443114331 implements MigrationInterface {
    name = 'TemplateMapping1699443114331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rvn_template_mapping" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_b32658bbf9867d26b021b2776ef" DEFAULT NEWSEQUENTIALID(), "tab_id" uniqueidentifier NOT NULL, "field_definition_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_b32658bbf9867d26b021b2776ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc47b96d38d53d40b6d3634d2b" ON "rvn_template_mapping" ("tab_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_39142fa914e8ed5c57dec8e95c" ON "rvn_template_mapping" ("field_definition_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b32658bbf9867d26b021b2776e" ON "rvn_template_mapping" ("id") `);
        await queryRunner.query(`CREATE TABLE "rvn_template_mapping_pipeline_stage" ("template_mapping_id" uniqueidentifier NOT NULL, "pipeline_stage_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_cc1a91a24a0026f857809ab24fe" PRIMARY KEY ("template_mapping_id", "pipeline_stage_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d1ba8524211a40fa8641ecddec" ON "rvn_template_mapping_pipeline_stage" ("template_mapping_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff5d5059c9178a11f86c5bd76f" ON "rvn_template_mapping_pipeline_stage" ("pipeline_stage_id") `);
        await queryRunner.query(`ALTER TABLE "rvn_note_fields" ADD "template_field_id" nvarchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rvn_cca_token_caches" ADD "is_encrypted" bit NOT NULL CONSTRAINT "DF_6716c3263ea593141e2adcb823e" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "rvn_template_mapping" ADD CONSTRAINT "FK_bc47b96d38d53d40b6d3634d2b4" FOREIGN KEY ("tab_id") REFERENCES "rvn_tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rvn_template_mapping" ADD CONSTRAINT "FK_39142fa914e8ed5c57dec8e95c4" FOREIGN KEY ("field_definition_id") REFERENCES "rvn_tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rvn_template_mapping_pipeline_stage" ADD CONSTRAINT "FK_d1ba8524211a40fa8641ecddec5" FOREIGN KEY ("template_mapping_id") REFERENCES "rvn_template_mapping"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rvn_template_mapping_pipeline_stage" ADD CONSTRAINT "FK_ff5d5059c9178a11f86c5bd76ff" FOREIGN KEY ("pipeline_stage_id") REFERENCES "rvn_pipeline_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rvn_template_mapping_pipeline_stage" DROP CONSTRAINT "FK_ff5d5059c9178a11f86c5bd76ff"`);
        await queryRunner.query(`ALTER TABLE "rvn_template_mapping_pipeline_stage" DROP CONSTRAINT "FK_d1ba8524211a40fa8641ecddec5"`);
        await queryRunner.query(`ALTER TABLE "rvn_template_mapping" DROP CONSTRAINT "FK_39142fa914e8ed5c57dec8e95c4"`);
        await queryRunner.query(`ALTER TABLE "rvn_template_mapping" DROP CONSTRAINT "FK_bc47b96d38d53d40b6d3634d2b4"`);
        await queryRunner.query(`ALTER TABLE "rvn_cca_token_caches" DROP CONSTRAINT "DF_6716c3263ea593141e2adcb823e"`);
        await queryRunner.query(`ALTER TABLE "rvn_cca_token_caches" DROP COLUMN "is_encrypted"`);
        await queryRunner.query(`ALTER TABLE "rvn_note_fields" DROP COLUMN "template_field_id"`);
        await queryRunner.query(`DROP INDEX "IDX_ff5d5059c9178a11f86c5bd76f" ON "rvn_template_mapping_pipeline_stage"`);
        await queryRunner.query(`DROP INDEX "IDX_d1ba8524211a40fa8641ecddec" ON "rvn_template_mapping_pipeline_stage"`);
        await queryRunner.query(`DROP TABLE "rvn_template_mapping_pipeline_stage"`);
        await queryRunner.query(`DROP INDEX "IDX_b32658bbf9867d26b021b2776e" ON "rvn_template_mapping"`);
        await queryRunner.query(`DROP INDEX "IDX_39142fa914e8ed5c57dec8e95c" ON "rvn_template_mapping"`);
        await queryRunner.query(`DROP INDEX "IDX_bc47b96d38d53d40b6d3634d2b" ON "rvn_template_mapping"`);
        await queryRunner.query(`DROP TABLE "rvn_template_mapping"`);
    }

}
