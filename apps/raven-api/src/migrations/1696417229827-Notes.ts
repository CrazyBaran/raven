import { MigrationInterface, QueryRunner } from 'typeorm';

export class Notes1696417229827 implements MigrationInterface {
  public name = 'Notes1696417229827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_notes" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_9a4441f77e4a2b20f79fc553c08" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(50) NOT NULL, "version" int NOT NULL, "previous_version_id" uniqueidentifier, "opportunity_id" uniqueidentifier NOT NULL, "created_by_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_1079096f6cd35dde8811d81ea9d" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_f7230566f406a4e64737163dc93" DEFAULT getdate(), CONSTRAINT "PK_9a4441f77e4a2b20f79fc553c08" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab81999da30ba7e4a70660dad4" ON "rvn_notes" ("opportunity_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4bce669ec45614fcc0c658cb20" ON "rvn_notes" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f7230566f406a4e64737163dc9" ON "rvn_notes" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bc7cbe8e92ce3c65e71747681e" ON "rvn_notes" ("id", "opportunity_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "REL_f0037ab29541227112fec724e1" ON "rvn_notes" ("previous_version_id") WHERE "previous_version_id" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_note_field_groups" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_d2a1c5839e636898079ac9df353" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(50) NOT NULL, "order" int NOT NULL, "note_id" uniqueidentifier NOT NULL, "created_by_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_530729baa08e322fe6deaa73c2d" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_f95eb642dce1e07ec7f68d4e396" DEFAULT getdate(), CONSTRAINT "PK_d2a1c5839e636898079ac9df353" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7b833651f23a231dd0879c95a8" ON "rvn_note_field_groups" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f95eb642dce1e07ec7f68d4e39" ON "rvn_note_field_groups" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fe3f88b0564d695b47d7fe13cc" ON "rvn_note_field_groups" ("id", "note_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_note_fields" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_09993575d11ca0f7734dc5af714" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(50) NOT NULL, "type" nvarchar(50) NOT NULL, "order" int NOT NULL, "value" nvarchar(255), "note_group_id" uniqueidentifier NOT NULL, "created_by_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_33525b7287435d31d3dcd66900f" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_f476ca415108be0c9831f507716" DEFAULT getdate(), CONSTRAINT "PK_09993575d11ca0f7734dc5af714" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_703e3b0e316225cc92cf81ce88" ON "rvn_note_fields" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f476ca415108be0c9831f50771" ON "rvn_note_fields" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_580829bcf208c4d510ec4c0150" ON "rvn_note_fields" ("id", "note_group_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD CONSTRAINT "FK_f0037ab29541227112fec724e1f" FOREIGN KEY ("previous_version_id") REFERENCES "rvn_notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD CONSTRAINT "FK_ab81999da30ba7e4a70660dad4c" FOREIGN KEY ("opportunity_id") REFERENCES "rvn_opportunities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD CONSTRAINT "FK_4bce669ec45614fcc0c658cb20a" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_field_groups" ADD CONSTRAINT "FK_873f6bcfe42f36774a528df8aab" FOREIGN KEY ("note_id") REFERENCES "rvn_notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_field_groups" ADD CONSTRAINT "FK_7b833651f23a231dd0879c95a88" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" ADD CONSTRAINT "FK_c9e70fcbc2db671965a32e428fc" FOREIGN KEY ("note_group_id") REFERENCES "rvn_note_field_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" ADD CONSTRAINT "FK_703e3b0e316225cc92cf81ce88e" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" DROP CONSTRAINT "FK_703e3b0e316225cc92cf81ce88e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_fields" DROP CONSTRAINT "FK_c9e70fcbc2db671965a32e428fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_field_groups" DROP CONSTRAINT "FK_7b833651f23a231dd0879c95a88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_field_groups" DROP CONSTRAINT "FK_873f6bcfe42f36774a528df8aab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP CONSTRAINT "FK_4bce669ec45614fcc0c658cb20a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP CONSTRAINT "FK_ab81999da30ba7e4a70660dad4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP CONSTRAINT "FK_f0037ab29541227112fec724e1f"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_580829bcf208c4d510ec4c0150" ON "rvn_note_fields"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f476ca415108be0c9831f50771" ON "rvn_note_fields"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_703e3b0e316225cc92cf81ce88" ON "rvn_note_fields"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_note_fields"`);
    await queryRunner.query(
      `DROP INDEX "IDX_fe3f88b0564d695b47d7fe13cc" ON "rvn_note_field_groups"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f95eb642dce1e07ec7f68d4e39" ON "rvn_note_field_groups"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_7b833651f23a231dd0879c95a8" ON "rvn_note_field_groups"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_note_field_groups"`);
    await queryRunner.query(
      `DROP INDEX "REL_f0037ab29541227112fec724e1" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_bc7cbe8e92ce3c65e71747681e" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f7230566f406a4e64737163dc9" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_4bce669ec45614fcc0c658cb20" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_ab81999da30ba7e4a70660dad4" ON "rvn_notes"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_notes"`);
  }
}
