import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShortlistsContributors1709126000275 implements MigrationInterface {
  public name = 'ShortlistsContributors1709126000275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_shortlist_contributor" ("shortlist_id" uniqueidentifier NOT NULL, "user_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_e4a52d40829e50043b5db89f413" PRIMARY KEY ("shortlist_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2d0fddc9341e5e8627134709a7" ON "rvn_shortlist_contributor" ("shortlist_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4cd592a677f0b7074d82f148b9" ON "rvn_shortlist_contributor" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist_contributor" ADD CONSTRAINT "FK_2d0fddc9341e5e8627134709a7c" FOREIGN KEY ("shortlist_id") REFERENCES "rvn_shortlist"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist_contributor" ADD CONSTRAINT "FK_4cd592a677f0b7074d82f148b97" FOREIGN KEY ("user_id") REFERENCES "rvn_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist_contributor" DROP CONSTRAINT "FK_4cd592a677f0b7074d82f148b97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist_contributor" DROP CONSTRAINT "FK_2d0fddc9341e5e8627134709a7c"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_4cd592a677f0b7074d82f148b9" ON "rvn_shortlist_contributor"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_2d0fddc9341e5e8627134709a7" ON "rvn_shortlist_contributor"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_shortlist_contributor"`);
  }
}
