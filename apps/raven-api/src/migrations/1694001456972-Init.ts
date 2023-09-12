import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1694001456972 implements MigrationInterface {
  public name = 'Init1694001456972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_roles" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_4d297cd1bbebfaca86185aa5183" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_f615ebbb3bfe80f773794c6caed" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_a12a5dffd83da08198ec88b8b97" DEFAULT getdate(), CONSTRAINT "UQ_54dd7bee5b37bbd5e0922c74d44" UNIQUE ("name"), CONSTRAINT "PK_4d297cd1bbebfaca86185aa5183" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_users" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_8df6d95528460217984eda43545" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "activated" bit NOT NULL CONSTRAINT "DF_046edefcf366e813528f9fde3cb" DEFAULT 0, "activation_date" datetime, "suspended" bit NOT NULL CONSTRAINT "DF_5cd45bf89200a3d0ed9a00189bd" DEFAULT 0, "suspension_date" datetime, "session_invalidated" bit NOT NULL CONSTRAINT "DF_bffe357fecdf3886e84998046da" DEFAULT 0, "created_at" datetime2 NOT NULL CONSTRAINT "DF_ac70064c48a8fb0a0b877074c5e" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_3d0920e27092d36f225e3861b97" DEFAULT getdate(), CONSTRAINT "UQ_b9f02b3fbee422b8e7605a09af1" UNIQUE ("email"), CONSTRAINT "PK_8df6d95528460217984eda43545" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cf41cd1b62089ce20c60acaf04" ON "rvn_users" ("id", "activated", "suspended", "session_invalidated") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_shares_teams" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_646ad22bf0ab8ac043152be142d" DEFAULT NEWSEQUENTIALID(), "role" varchar(255) NOT NULL, "actor_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_d754dd047e4544cd3c26d63a92b" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_42fb60b8be1f8a8695c3da074bd" DEFAULT getdate(), "resource_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_646ad22bf0ab8ac043152be142d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_bf675b8756bc812d34b4439666" ON "rvn_shares_teams" ("actor_id", "resource_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf87d08ceaf41b35b34526f6c7" ON "rvn_shares_teams" ("resource_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b1dc587ce82c458043b6a04a22" ON "rvn_shares_teams" ("actor_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_teams" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_25a7fe4585f97fc9a54144c66d0" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "domain" nvarchar(255), "saml_issuer" nvarchar(255), "saml_cert" nvarchar(4000), "saml_entry_point" nvarchar(255), "saml_sign_assertions" bit NOT NULL CONSTRAINT "DF_3cc5c2be448344d969685905f1d" DEFAULT 1, "saml_sign_authn_response" bit NOT NULL CONSTRAINT "DF_c8bb9137ca0723c459be900c543" DEFAULT 1, "saml_identifier_format" nvarchar(255) NOT NULL CONSTRAINT "DF_378512aa10f5fa91d39052f2264" DEFAULT 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress', "created_at" datetime2 NOT NULL CONSTRAINT "DF_e6ab6088f60856bfb486fb24644" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_93bd89b2aeeddaba4e82065183f" DEFAULT getdate(), "deleted_at" datetime2, CONSTRAINT "UQ_7325bfb2076f53074faa0884940" UNIQUE ("name"), CONSTRAINT "PK_25a7fe4585f97fc9a54144c66d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rvn_users_sessions" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_bc915aa82889fa2f7b21866582f" DEFAULT NEWSEQUENTIALID(), "user_id" uniqueidentifier NOT NULL, "ip" nvarchar(255) NOT NULL, "agent" nvarchar(255) NOT NULL, "refresh" nvarchar(4000) NOT NULL, "invalidated" bit NOT NULL CONSTRAINT "DF_09e6898a5fce400a4f637ebee27" DEFAULT 0, "last_use_ip" nvarchar(255) NOT NULL, "last_use_agent" nvarchar(255) NOT NULL, "last_use_date" datetime NOT NULL, "expires_at" datetime NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_88a5ccf1cb7da44d5bdbf76c194" DEFAULT getdate(), CONSTRAINT "PK_bc915aa82889fa2f7b21866582f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_42eb6649b2481904c16f6a7258" ON "rvn_users_sessions" ("user_id", "ip", "agent", "invalidated", "expires_at") `,
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
      `ALTER TABLE "rvn_shares_teams" ADD CONSTRAINT "FK_b1dc587ce82c458043b6a04a224" FOREIGN KEY ("actor_id") REFERENCES "rvn_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shares_teams" ADD CONSTRAINT "FK_cf87d08ceaf41b35b34526f6c7d" FOREIGN KEY ("resource_id") REFERENCES "rvn_teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users_sessions" ADD CONSTRAINT "FK_ed7724357107d0f9e8b90d0e337" FOREIGN KEY ("user_id") REFERENCES "rvn_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users_roles" ADD CONSTRAINT "FK_3391da2858fab2971a279d58ab0" FOREIGN KEY ("user_id") REFERENCES "rvn_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users_roles" ADD CONSTRAINT "FK_7c4c94e64596ab4462500d15d5f" FOREIGN KEY ("role_id") REFERENCES "rvn_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_users_roles" DROP CONSTRAINT "FK_7c4c94e64596ab4462500d15d5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users_roles" DROP CONSTRAINT "FK_3391da2858fab2971a279d58ab0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users_sessions" DROP CONSTRAINT "FK_ed7724357107d0f9e8b90d0e337"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shares_teams" DROP CONSTRAINT "FK_cf87d08ceaf41b35b34526f6c7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shares_teams" DROP CONSTRAINT "FK_b1dc587ce82c458043b6a04a224"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_7c4c94e64596ab4462500d15d5" ON "rvn_users_roles"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_3391da2858fab2971a279d58ab" ON "rvn_users_roles"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_users_roles"`);
    await queryRunner.query(
      `DROP INDEX "IDX_42eb6649b2481904c16f6a7258" ON "rvn_users_sessions"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_users_sessions"`);
    await queryRunner.query(`DROP TABLE "rvn_teams"`);
    await queryRunner.query(
      `DROP INDEX "IDX_b1dc587ce82c458043b6a04a22" ON "rvn_shares_teams"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_cf87d08ceaf41b35b34526f6c7" ON "rvn_shares_teams"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_bf675b8756bc812d34b4439666" ON "rvn_shares_teams"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_shares_teams"`);
    await queryRunner.query(
      `DROP INDEX "IDX_cf41cd1b62089ce20c60acaf04" ON "rvn_users"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_users"`);
    await queryRunner.query(`DROP TABLE "rvn_roles"`);
  }
}
