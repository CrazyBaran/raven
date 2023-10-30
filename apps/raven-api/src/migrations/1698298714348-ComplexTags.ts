import { MigrationInterface, QueryRunner } from 'typeorm';

export class ComplexTags1698298714348 implements MigrationInterface {
  public name = 'ComplexTags1698298714348';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_complex_tags" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_7c418328a52cd13ca39a0f899a3" DEFAULT NEWSEQUENTIALID(), CONSTRAINT "PK_7c418328a52cd13ca39a0f899a3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7c418328a52cd13ca39a0f899a" ON "rvn_complex_tags" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_complex_tag_tags" ("complex_tag_id" uniqueidentifier NOT NULL, "tag_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_0f11d34684a51bcfb4f9da34d4d" PRIMARY KEY ("complex_tag_id", "tag_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e899f1503fcd7c36a9bea4a6f7" ON "rvn_complex_tag_tags" ("complex_tag_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_15ec8f0bdf872342162ed3bbd0" ON "rvn_complex_tag_tags" ("tag_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_note_complex_tags" ("note_id" uniqueidentifier NOT NULL, "complex_tag_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_0dfaaf38beaff48c730f7a6d318" PRIMARY KEY ("note_id", "complex_tag_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c2b7a08868691124c2a24d3785" ON "rvn_note_complex_tags" ("note_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3cadb6a459e6ecf681cea1c603" ON "rvn_note_complex_tags" ("complex_tag_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca6c3778dbbed393aa909f5f94" ON "rvn_notes" ("root_version_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_complex_tag_tags" ADD CONSTRAINT "FK_e899f1503fcd7c36a9bea4a6f70" FOREIGN KEY ("complex_tag_id") REFERENCES "rvn_complex_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_complex_tag_tags" ADD CONSTRAINT "FK_15ec8f0bdf872342162ed3bbd0b" FOREIGN KEY ("tag_id") REFERENCES "rvn_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_complex_tags" ADD CONSTRAINT "FK_c2b7a08868691124c2a24d37852" FOREIGN KEY ("note_id") REFERENCES "rvn_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_complex_tags" ADD CONSTRAINT "FK_3cadb6a459e6ecf681cea1c6033" FOREIGN KEY ("complex_tag_id") REFERENCES "rvn_complex_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_note_complex_tags" DROP CONSTRAINT "FK_3cadb6a459e6ecf681cea1c6033"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_note_complex_tags" DROP CONSTRAINT "FK_c2b7a08868691124c2a24d37852"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_complex_tag_tags" DROP CONSTRAINT "FK_15ec8f0bdf872342162ed3bbd0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_complex_tag_tags" DROP CONSTRAINT "FK_e899f1503fcd7c36a9bea4a6f70"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_ca6c3778dbbed393aa909f5f94" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3cadb6a459e6ecf681cea1c603" ON "rvn_note_complex_tags"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_c2b7a08868691124c2a24d3785" ON "rvn_note_complex_tags"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_note_complex_tags"`);
    await queryRunner.query(
      `DROP INDEX "IDX_15ec8f0bdf872342162ed3bbd0" ON "rvn_complex_tag_tags"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_e899f1503fcd7c36a9bea4a6f7" ON "rvn_complex_tag_tags"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_complex_tag_tags"`);
    await queryRunner.query(
      `DROP INDEX "IDX_7c418328a52cd13ca39a0f899a" ON "rvn_complex_tags"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_complex_tags"`);
  }
}
