import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedByForTemplatesRemoved1702022535402
  implements MigrationInterface
{
  public name = 'CreatedByForTemplatesRemoved1702022535402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" DROP CONSTRAINT "FK_5b26e41e72d376b0cd17c40bc93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" DROP CONSTRAINT "FK_cf6357d827ac205238661a0b60c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" DROP CONSTRAINT "FK_af9c2c278a3e7b82252fc13df7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tabs" DROP CONSTRAINT "FK_f155425b80463ef9a8d4b1fb210"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_5b26e41e72d376b0cd17c40bc9" ON "rvn_templates"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_cf6357d827ac205238661a0b60" ON "rvn_field_groups"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_af9c2c278a3e7b82252fc13df7" ON "rvn_field_definitions"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f155425b80463ef9a8d4b1fb21" ON "rvn_tabs"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" DROP COLUMN "created_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" DROP COLUMN "created_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" DROP COLUMN "created_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tabs" DROP COLUMN "created_by_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_tabs" ADD "created_by_id" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" ADD "created_by_id" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" ADD "created_by_id" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" ADD "created_by_id" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f155425b80463ef9a8d4b1fb21" ON "rvn_tabs" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_af9c2c278a3e7b82252fc13df7" ON "rvn_field_definitions" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf6357d827ac205238661a0b60" ON "rvn_field_groups" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5b26e41e72d376b0cd17c40bc9" ON "rvn_templates" ("created_by_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tabs" ADD CONSTRAINT "FK_f155425b80463ef9a8d4b1fb210" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_definitions" ADD CONSTRAINT "FK_af9c2c278a3e7b82252fc13df7d" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" ADD CONSTRAINT "FK_cf6357d827ac205238661a0b60c" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_templates" ADD CONSTRAINT "FK_5b26e41e72d376b0cd17c40bc93" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
