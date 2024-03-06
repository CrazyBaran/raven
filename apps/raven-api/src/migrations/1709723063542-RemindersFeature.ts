import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemindersFeature1709723063542 implements MigrationInterface {
  public name = 'RemindersFeature1709723063542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_reminder" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_f57ce2716920546554c0a03fe6b" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(256) NOT NULL, "description" nvarchar(1000), "creator_id" uniqueidentifier, "assigned_by_id" uniqueidentifier, "tag_id" uniqueidentifier, "due_date" datetime NOT NULL, "completed_date" datetime, "created_at" datetime2 NOT NULL CONSTRAINT "DF_071bb0808c9061b0ccffa7aeb2f" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_3ecd2e6b6c5f7c2529e58d4170e" DEFAULT getdate(), CONSTRAINT "PK_f57ce2716920546554c0a03fe6b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_33e1d97128bccee07cd70e0d65" ON "rvn_reminder" ("due_date") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f57ce2716920546554c0a03fe6" ON "rvn_reminder" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_reminder_assignee" ("reminder_id" uniqueidentifier NOT NULL, "user_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_ac0b1620f416b8bbd956fa66cd9" PRIMARY KEY ("reminder_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f732636131512b7557a75d908b" ON "rvn_reminder_assignee" ("reminder_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_07043197bcebf74781f579b1d7" ON "rvn_reminder_assignee" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder" ADD CONSTRAINT "FK_475286ba1cebecae9e84e112eaa" FOREIGN KEY ("creator_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder" ADD CONSTRAINT "FK_dcbfa4e5a913a30814acd605a7d" FOREIGN KEY ("assigned_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder" ADD CONSTRAINT "FK_537c407daaf77d19e32e45ced86" FOREIGN KEY ("tag_id") REFERENCES "rvn_complex_tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder_assignee" ADD CONSTRAINT "FK_f732636131512b7557a75d908b7" FOREIGN KEY ("reminder_id") REFERENCES "rvn_reminder"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder_assignee" ADD CONSTRAINT "FK_07043197bcebf74781f579b1d7d" FOREIGN KEY ("user_id") REFERENCES "rvn_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder_assignee" DROP CONSTRAINT "FK_07043197bcebf74781f579b1d7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder_assignee" DROP CONSTRAINT "FK_f732636131512b7557a75d908b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder" DROP CONSTRAINT "FK_537c407daaf77d19e32e45ced86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder" DROP CONSTRAINT "FK_dcbfa4e5a913a30814acd605a7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_reminder" DROP CONSTRAINT "FK_475286ba1cebecae9e84e112eaa"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_07043197bcebf74781f579b1d7" ON "rvn_reminder_assignee"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_f732636131512b7557a75d908b" ON "rvn_reminder_assignee"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_reminder_assignee"`);
    await queryRunner.query(
      `DROP INDEX "IDX_f57ce2716920546554c0a03fe6" ON "rvn_reminder"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_33e1d97128bccee07cd70e0d65" ON "rvn_reminder"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_reminder"`);
  }
}
