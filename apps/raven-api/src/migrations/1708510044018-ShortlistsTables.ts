import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShortlistsTables1708510044018 implements MigrationInterface {
  public name = 'ShortlistsTables1708510044018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_shortlist" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_33a20b69b58380a17e3ce852512" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(256) NOT NULL, "description" nvarchar(1000), "type" nvarchar(30) CONSTRAINT CHK_bfd6d8ad5301f767376f577eec_ENUM CHECK(type IN ('personal','custom')) NOT NULL CONSTRAINT "DF_9bd6dca6fd96a573b31d1ea7329" DEFAULT 'custom', "creator_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_9b67872e13d73898747c3e6a446" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_bae8618f17b46c5844e239b5a79" DEFAULT getdate(), CONSTRAINT "PK_33a20b69b58380a17e3ce852512" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_33a20b69b58380a17e3ce85251" ON "rvn_shortlist" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_shortlist_organisation" ("shortlist_id" uniqueidentifier NOT NULL, "organisation_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_c4765e4c47c069673acf12437b1" PRIMARY KEY ("shortlist_id", "organisation_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_89c5a60096a7b1c554aef179ca" ON "rvn_shortlist_organisation" ("shortlist_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dee247ce6310fe9da4e4ad3132" ON "rvn_shortlist_organisation" ("organisation_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" ADD CONSTRAINT "FK_fd575b6fa9a699b2220bbb5d047" FOREIGN KEY ("creator_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist_organisation" ADD CONSTRAINT "FK_89c5a60096a7b1c554aef179cae" FOREIGN KEY ("shortlist_id") REFERENCES "rvn_shortlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist_organisation" ADD CONSTRAINT "FK_dee247ce6310fe9da4e4ad3132b" FOREIGN KEY ("organisation_id") REFERENCES "rvn_organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist_organisation" DROP CONSTRAINT "FK_dee247ce6310fe9da4e4ad3132b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist_organisation" DROP CONSTRAINT "FK_89c5a60096a7b1c554aef179cae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" DROP CONSTRAINT "FK_fd575b6fa9a699b2220bbb5d047"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_dee247ce6310fe9da4e4ad3132" ON "rvn_shortlist_organisation"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_89c5a60096a7b1c554aef179ca" ON "rvn_shortlist_organisation"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_shortlist_organisation"`);
    await queryRunner.query(
      `DROP INDEX "IDX_33a20b69b58380a17e3ce85251" ON "rvn_shortlist"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_shortlist"`);
  }
}
