import { MigrationInterface, QueryRunner } from 'typeorm';

export class Templates1696335287638 implements MigrationInterface {
  public name = 'Templates1696335287638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_templates" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_d568cefa3aa403438f2d44f5532" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(50) NOT NULL, "version" int NOT NULL, "previous_version_id" uniqueidentifier, "created_by_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_f8752cfc2004d22eadf8db76de8" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_1f0162157d1ccb6b9954bbc060d" DEFAULT getdate(), CONSTRAINT "PK_d568cefa3aa403438f2d44f5532" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5b26e41e72d376b0cd17c40bc9" ON "rvn_templates" ("created_by_id") `,
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
      `CREATE TABLE "rvn_field_groups" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_17d20a5d02086ec35cddba3afbe" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(50) NOT NULL, "order" int NOT NULL, "template_id" uniqueidentifier NOT NULL, "created_by_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_1e52f09f7c371c8d59bda715459" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_005118af46f22fcc925ea6c3c4f" DEFAULT getdate(), CONSTRAINT "PK_17d20a5d02086ec35cddba3afbe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf6357d827ac205238661a0b60" ON "rvn_field_groups" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_005118af46f22fcc925ea6c3c4" ON "rvn_field_groups" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cf311a75fe39f2772cfae0b866" ON "rvn_field_groups" ("id", "template_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_field_definitions" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_6541e662a31b2195bd9eeb1e34b" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(50) NOT NULL, "type" nvarchar(50) NOT NULL, "order" int NOT NULL, "group_id" uniqueidentifier NOT NULL, "created_by_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_db4ce859a0b16b4b0890a0b1a92" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_3b345e0daadcf4f82590c33586a" DEFAULT getdate(), CONSTRAINT "PK_6541e662a31b2195bd9eeb1e34b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_af9c2c278a3e7b82252fc13df7" ON "rvn_field_definitions" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3b345e0daadcf4f82590c33586" ON "rvn_field_definitions" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2aaec7693a56e203e22aab677a" ON "rvn_field_definitions" ("id", "group_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" ADD CONSTRAINT "FK_992e3dad9cc972993f4931d87cc" FOREIGN KEY ("previous_version_id") REFERENCES "rvn_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" ADD CONSTRAINT "FK_5b26e41e72d376b0cd17c40bc93" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" ADD CONSTRAINT "FK_e78f42db23c6aeaedeb3d77e1c6" FOREIGN KEY ("template_id") REFERENCES "rvn_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" ADD CONSTRAINT "FK_cf6357d827ac205238661a0b60c" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" ADD CONSTRAINT "FK_c84ed44dff750d8eedd5f1507eb" FOREIGN KEY ("group_id") REFERENCES "rvn_field_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" ADD CONSTRAINT "FK_af9c2c278a3e7b82252fc13df7d" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" DROP CONSTRAINT "FK_af9c2c278a3e7b82252fc13df7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" DROP CONSTRAINT "FK_c84ed44dff750d8eedd5f1507eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" DROP CONSTRAINT "FK_cf6357d827ac205238661a0b60c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" DROP CONSTRAINT "FK_e78f42db23c6aeaedeb3d77e1c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" DROP CONSTRAINT "FK_5b26e41e72d376b0cd17c40bc93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" DROP CONSTRAINT "FK_992e3dad9cc972993f4931d87cc"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_2aaec7693a56e203e22aab677a" ON "rvn_field_definitions"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3b345e0daadcf4f82590c33586" ON "rvn_field_definitions"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_af9c2c278a3e7b82252fc13df7" ON "rvn_field_definitions"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_field_definitions"`);
    await queryRunner.query(
      `DROP INDEX "IDX_cf311a75fe39f2772cfae0b866" ON "rvn_field_groups"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_005118af46f22fcc925ea6c3c4" ON "rvn_field_groups"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_cf6357d827ac205238661a0b60" ON "rvn_field_groups"`,
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
      `DROP INDEX "IDX_5b26e41e72d376b0cd17c40bc9" ON "rvn_templates"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_templates"`);
  }
}
