import { MigrationInterface, QueryRunner } from 'typeorm';

export class TagEntity1697548394400 implements MigrationInterface {
  public name = 'TagEntity1697548394400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_tags" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_768cc5495152d4189958d9c20ca" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "type" varchar(255) NOT NULL, "class" varchar(255) NOT NULL, "user_id" uniqueidentifier, "organisation_id" uniqueidentifier, CONSTRAINT "PK_768cc5495152d4189958d9c20ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5a3b257e9c2c09d40808b1d59b" ON "rvn_tags" ("name", "type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4f5700ff0dac744b960fd6a34b" ON "rvn_tags" ("id", "type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9633fa977d55fda2e8dddcf567" ON "rvn_tags" ("class") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_note_tags" ("note_id" uniqueidentifier NOT NULL, "tag_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_5cfce1f58d122481db44936bfbb" PRIMARY KEY ("note_id", "tag_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6b84ceba4da7f9114aa0567ae7" ON "rvn_note_tags" ("note_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_129cfb7f3534f71201230964b3" ON "rvn_note_tags" ("tag_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" ADD CONSTRAINT "FK_95d5a483bdb9dc2bb22c9242c5f" FOREIGN KEY ("user_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" ADD CONSTRAINT "FK_31f89c357c2e81142d38d20665f" FOREIGN KEY ("organisation_id") REFERENCES "rvn_organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_tags" ADD CONSTRAINT "FK_6b84ceba4da7f9114aa0567ae77" FOREIGN KEY ("note_id") REFERENCES "rvn_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_tags" ADD CONSTRAINT "FK_129cfb7f3534f71201230964b37" FOREIGN KEY ("tag_id") REFERENCES "rvn_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_note_tags" DROP CONSTRAINT "FK_129cfb7f3534f71201230964b37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_tags" DROP CONSTRAINT "FK_6b84ceba4da7f9114aa0567ae77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" DROP CONSTRAINT "FK_31f89c357c2e81142d38d20665f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" DROP CONSTRAINT "FK_95d5a483bdb9dc2bb22c9242c5f"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_129cfb7f3534f71201230964b3" ON "rvn_note_tags"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_6b84ceba4da7f9114aa0567ae7" ON "rvn_note_tags"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_note_tags"`);
    await queryRunner.query(
      `DROP INDEX "IDX_9633fa977d55fda2e8dddcf567" ON "rvn_tags"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_4f5700ff0dac744b960fd6a34b" ON "rvn_tags"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_5a3b257e9c2c09d40808b1d59b" ON "rvn_tags"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_tags"`);
  }
}
