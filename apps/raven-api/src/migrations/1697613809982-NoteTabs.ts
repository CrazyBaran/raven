import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoteTabs1697613809982 implements MigrationInterface {
  public name = 'NoteTabs1697613809982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_note_tabs" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_19bd27d2f93f1211833579857cd" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(50) NOT NULL, "order" int NOT NULL, "note_id" uniqueidentifier NOT NULL, "created_by_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_4d2cfe761e141950667c494aea8" DEFAULT getdate(), "updated_by_id" uniqueidentifier NOT NULL, "updated_at" datetime2 NOT NULL CONSTRAINT "DF_45982c031c4b702791e64b50d7a" DEFAULT getdate(), CONSTRAINT "PK_19bd27d2f93f1211833579857cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0d6192f6673fff1a347dfc8b58" ON "rvn_note_tabs" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf1b39c25f156dae0b2a2f727e" ON "rvn_note_tabs" ("updated_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_45982c031c4b702791e64b50d7" ON "rvn_note_tabs" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e366442af1474980a49dc0a570" ON "rvn_note_tabs" ("id", "note_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_field_groups" ADD "note_tab_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_tabs" ADD CONSTRAINT "FK_631ddde1ad2ec78353e796cf1f1" FOREIGN KEY ("note_id") REFERENCES "rvn_notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_tabs" ADD CONSTRAINT "FK_0d6192f6673fff1a347dfc8b58e" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_tabs" ADD CONSTRAINT "FK_cf1b39c25f156dae0b2a2f727e7" FOREIGN KEY ("updated_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_field_groups" ADD CONSTRAINT "FK_7087ce89bd89bff7d4469864cfd" FOREIGN KEY ("note_tab_id") REFERENCES "rvn_note_tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_note_field_groups" DROP CONSTRAINT "FK_7087ce89bd89bff7d4469864cfd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_tabs" DROP CONSTRAINT "FK_cf1b39c25f156dae0b2a2f727e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_tabs" DROP CONSTRAINT "FK_0d6192f6673fff1a347dfc8b58e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_tabs" DROP CONSTRAINT "FK_631ddde1ad2ec78353e796cf1f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_field_groups" DROP COLUMN "note_tab_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_e366442af1474980a49dc0a570" ON "rvn_note_tabs"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_45982c031c4b702791e64b50d7" ON "rvn_note_tabs"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_cf1b39c25f156dae0b2a2f727e" ON "rvn_note_tabs"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_0d6192f6673fff1a347dfc8b58" ON "rvn_note_tabs"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_note_tabs"`);
  }
}
