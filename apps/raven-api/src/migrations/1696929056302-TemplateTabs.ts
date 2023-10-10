import { MigrationInterface, QueryRunner } from 'typeorm';

export class TemplateTabs1696929056302 implements MigrationInterface {
  public name = 'TemplateTabs1696929056302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_tabs" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_335a9ba756f42692ac848704c56" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(50) NOT NULL, "order" int NOT NULL, "template_id" uniqueidentifier NOT NULL, "created_by_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_feb2344741d3c1fea1257a4c81c" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_73a9d398875b111098da97037ef" DEFAULT getdate(), CONSTRAINT "PK_335a9ba756f42692ac848704c56" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f155425b80463ef9a8d4b1fb21" ON "rvn_tabs" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_73a9d398875b111098da97037e" ON "rvn_tabs" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cecf9562320190420cb955f0c3" ON "rvn_tabs" ("id", "template_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" ADD "tab_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" ADD CONSTRAINT "FK_e92c2571bb4d1b0b03913c6ed03" FOREIGN KEY ("tab_id") REFERENCES "rvn_tabs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tabs" ADD CONSTRAINT "FK_785b258dba2394aa39cd1bb3fee" FOREIGN KEY ("template_id") REFERENCES "rvn_templates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tabs" ADD CONSTRAINT "FK_f155425b80463ef9a8d4b1fb210" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_tabs" DROP CONSTRAINT "FK_f155425b80463ef9a8d4b1fb210"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tabs" DROP CONSTRAINT "FK_785b258dba2394aa39cd1bb3fee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" DROP CONSTRAINT "FK_e92c2571bb4d1b0b03913c6ed03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_field_groups" DROP COLUMN "tab_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_cecf9562320190420cb955f0c3" ON "rvn_tabs"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_73a9d398875b111098da97037e" ON "rvn_tabs"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f155425b80463ef9a8d4b1fb21" ON "rvn_tabs"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_tabs"`);
  }
}
