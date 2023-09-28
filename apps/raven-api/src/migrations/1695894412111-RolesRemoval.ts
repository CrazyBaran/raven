import { MigrationInterface, QueryRunner } from 'typeorm';

export class RolesRemoval1695894412111 implements MigrationInterface {
  public name = 'RolesRemoval1695894412111';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_users_roles" DROP CONSTRAINT "FK_7c4c94e64596ab4462500d15d5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users_roles" DROP CONSTRAINT "FK_3391da2858fab2971a279d58ab0"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_7c4c94e64596ab4462500d15d5" ON "rvn_users_roles"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3391da2858fab2971a279d58ab" ON "rvn_users_roles"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_users_roles"`);
    await queryRunner.query(`DROP TABLE "rvn_roles"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_roles" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_4d297cd1bbebfaca86185aa5183" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_f615ebbb3bfe80f773794c6caed" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_a12a5dffd83da08198ec88b8b97" DEFAULT getdate(), CONSTRAINT "UQ_54dd7bee5b37bbd5e0922c74d44" UNIQUE ("name"), CONSTRAINT "PK_4d297cd1bbebfaca86185aa5183" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_users_roles" ("user_id" uniqueidentifier NOT NULL, "role_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_10779b4900ed0bfc167abb70d50" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3391da2858fab2971a279d58ab" ON "rvn_users_roles" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c4c94e64596ab4462500d15d5" ON "rvn_users_roles" ("role_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users_roles" ADD CONSTRAINT "FK_3391da2858fab2971a279d58ab0" FOREIGN KEY ("user_id") REFERENCES "rvn_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users_roles" ADD CONSTRAINT "FK_7c4c94e64596ab4462500d15d5f" FOREIGN KEY ("role_id") REFERENCES "rvn_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
