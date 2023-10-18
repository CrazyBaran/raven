import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoteSoftDelete1697627424494 implements MigrationInterface {
  public name = 'NoteSoftDelete1697627424494';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD "deleted_at" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD "deleted_by_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_81111f4502011abdf91b1bb66f" ON "rvn_notes" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_73b7aa67118851c92be5219039" ON "rvn_notes" ("deleted_by_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" ADD CONSTRAINT "FK_73b7aa67118851c92be52190392" FOREIGN KEY ("deleted_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP CONSTRAINT "FK_73b7aa67118851c92be52190392"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_73b7aa67118851c92be5219039" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_81111f4502011abdf91b1bb66f" ON "rvn_notes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_notes" DROP COLUMN "deleted_by_id"`,
    );
    await queryRunner.query(`ALTER TABLE "rvn_notes" DROP COLUMN "deleted_at"`);
  }
}
