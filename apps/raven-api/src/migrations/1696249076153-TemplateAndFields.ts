import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplateAndFields1696249076153 implements MigrationInterface {
  public name = 'TemplateAndFields1696249076153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_field_contents" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_2e8bcc25a55f39f2e3f195b5521" DEFAULT NEWSEQUENTIALID(), "value" nvarchar(255) NOT NULL, "created_by_id" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_51d2eaaff46f450db2a216c18a4" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_6e5d36e6471d66bb9aaed790115" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, CONSTRAINT "PK_2e8bcc25a55f39f2e3f195b5521" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0f0981255d7323193260f76006" ON "rvn_field_contents" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6e5d36e6471d66bb9aaed79011" ON "rvn_field_contents" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_01de9ed6259447f02c02b6018e" ON "rvn_field_contents" ("id", "created_by") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_templates" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_d568cefa3aa403438f2d44f5532" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "version" int NOT NULL, "previous_version_id" uniqueidentifier, "created_by_id" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_f8752cfc2004d22eadf8db76de8" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_1f0162157d1ccb6b9954bbc060d" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, CONSTRAINT "PK_d568cefa3aa403438f2d44f5532" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_14fe60ebcc764a5b28cc884fe9" ON "rvn_templates" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f0162157d1ccb6b9954bbc060" ON "rvn_templates" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d568cefa3aa403438f2d44f553" ON "rvn_templates" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_992e3dad9cc972993f4931d87c" ON "rvn_templates" ("previous_version_id") WHERE "previous_version_id" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_field_groups" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_17d20a5d02086ec35cddba3afbe" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "order" int NOT NULL, "template_id" uniqueidentifier NOT NULL, "created_by_id" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_1e52f09f7c371c8d59bda715459" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_005118af46f22fcc925ea6c3c4f" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, CONSTRAINT "PK_17d20a5d02086ec35cddba3afbe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_69f1183819aa49f3ab74d3c327" ON "rvn_field_groups" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_005118af46f22fcc925ea6c3c4" ON "rvn_field_groups" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cf311a75fe39f2772cfae0b866" ON "rvn_field_groups" ("id", "template_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_field_definitions" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_6541e662a31b2195bd9eeb1e34b" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "type" nvarchar(255) NOT NULL, "order" int NOT NULL, "group_id" uniqueidentifier NOT NULL, "created_by_id" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_db4ce859a0b16b4b0890a0b1a92" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_3b345e0daadcf4f82590c33586a" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, CONSTRAINT "PK_6541e662a31b2195bd9eeb1e34b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_542a7407ec88eb101c654e29d4" ON "rvn_field_definitions" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3b345e0daadcf4f82590c33586" ON "rvn_field_definitions" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2aaec7693a56e203e22aab677a" ON "rvn_field_definitions" ("id", "group_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_opportunity_fields" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_ef5e0120bf87d08b60d3a1a6864" DEFAULT NEWSEQUENTIALID(), "field_content_id" uniqueidentifier NOT NULL, "field_definition_id" uniqueidentifier NOT NULL, "opportunity_id" uniqueidentifier NOT NULL, "created_by_id" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_e15b89e23f6bd955597f44d52fa" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_9b9a1998bac61bf9a946a036c23" DEFAULT getdate(), "created_by" uniqueidentifier NOT NULL, CONSTRAINT "PK_ef5e0120bf87d08b60d3a1a6864" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4d341a6223be3ae418634c0393" ON "rvn_opportunity_fields" ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b9a1998bac61bf9a946a036c2" ON "rvn_opportunity_fields" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_634345da5a0f05620a5d38c636" ON "rvn_opportunity_fields" ("id", "field_definition_id", "field_content_id", "opportunity_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_contents" ADD CONSTRAINT "FK_0f0981255d7323193260f76006b" FOREIGN KEY ("created_by") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" ADD CONSTRAINT "FK_992e3dad9cc972993f4931d87cc" FOREIGN KEY ("previous_version_id") REFERENCES "rvn_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" ADD CONSTRAINT "FK_14fe60ebcc764a5b28cc884fe9d" FOREIGN KEY ("created_by") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" ADD CONSTRAINT "FK_e78f42db23c6aeaedeb3d77e1c6" FOREIGN KEY ("template_id") REFERENCES "rvn_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" ADD CONSTRAINT "FK_69f1183819aa49f3ab74d3c3278" FOREIGN KEY ("created_by") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" ADD CONSTRAINT "FK_c84ed44dff750d8eedd5f1507eb" FOREIGN KEY ("group_id") REFERENCES "rvn_field_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" ADD CONSTRAINT "FK_542a7407ec88eb101c654e29d4c" FOREIGN KEY ("created_by") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunity_fields" ADD CONSTRAINT "FK_0a7ad04f7a0a24e003d5e63fe80" FOREIGN KEY ("field_content_id") REFERENCES "rvn_field_contents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunity_fields" ADD CONSTRAINT "FK_f00b863fc19fe46bcbd493c4ab9" FOREIGN KEY ("field_definition_id") REFERENCES "rvn_field_definitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunity_fields" ADD CONSTRAINT "FK_ca86db683d235ad6f5b42641f13" FOREIGN KEY ("opportunity_id") REFERENCES "rvn_opportunities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunity_fields" ADD CONSTRAINT "FK_4d341a6223be3ae418634c03931" FOREIGN KEY ("created_by") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunity_fields" DROP CONSTRAINT "FK_4d341a6223be3ae418634c03931"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunity_fields" DROP CONSTRAINT "FK_ca86db683d235ad6f5b42641f13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunity_fields" DROP CONSTRAINT "FK_f00b863fc19fe46bcbd493c4ab9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunity_fields" DROP CONSTRAINT "FK_0a7ad04f7a0a24e003d5e63fe80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" DROP CONSTRAINT "FK_542a7407ec88eb101c654e29d4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" DROP CONSTRAINT "FK_c84ed44dff750d8eedd5f1507eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" DROP CONSTRAINT "FK_69f1183819aa49f3ab74d3c3278"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" DROP CONSTRAINT "FK_e78f42db23c6aeaedeb3d77e1c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" DROP CONSTRAINT "FK_14fe60ebcc764a5b28cc884fe9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" DROP CONSTRAINT "FK_992e3dad9cc972993f4931d87cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_contents" DROP CONSTRAINT "FK_0f0981255d7323193260f76006b"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_634345da5a0f05620a5d38c636" ON "rvn_opportunity_fields"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_9b9a1998bac61bf9a946a036c2" ON "rvn_opportunity_fields"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_4d341a6223be3ae418634c0393" ON "rvn_opportunity_fields"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_opportunity_fields"`);
    await queryRunner.query(
      `DROP INDEX "IDX_2aaec7693a56e203e22aab677a" ON "rvn_field_definitions"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3b345e0daadcf4f82590c33586" ON "rvn_field_definitions"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_542a7407ec88eb101c654e29d4" ON "rvn_field_definitions"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_field_definitions"`);
    await queryRunner.query(
      `DROP INDEX "IDX_cf311a75fe39f2772cfae0b866" ON "rvn_field_groups"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_005118af46f22fcc925ea6c3c4" ON "rvn_field_groups"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_69f1183819aa49f3ab74d3c327" ON "rvn_field_groups"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_field_groups"`);
    await queryRunner.query(
      `DROP INDEX "REL_992e3dad9cc972993f4931d87c" ON "rvn_templates"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_d568cefa3aa403438f2d44f553" ON "rvn_templates"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_1f0162157d1ccb6b9954bbc060" ON "rvn_templates"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_14fe60ebcc764a5b28cc884fe9" ON "rvn_templates"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_templates"`);
    await queryRunner.query(
      `DROP INDEX "IDX_01de9ed6259447f02c02b6018e" ON "rvn_field_contents"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_6e5d36e6471d66bb9aaed79011" ON "rvn_field_contents"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_0f0981255d7323193260f76006" ON "rvn_field_contents"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_field_contents"`);
  }
}
