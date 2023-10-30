import { MigrationInterface, QueryRunner } from 'typeorm';

export class CcaTokenCache1698675554512 implements MigrationInterface {
  public name = 'CcaTokenCache1698675554512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_cca_token_caches" ("key" nvarchar(256) NOT NULL, "value" nvarchar(max) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_dcdfbd55547d91a64b7d59302c5" DEFAULT getdate(), "updated_at" datetime2 CONSTRAINT "DF_a2cdec3fb1244eb7f202c6b6212" DEFAULT getdate(), CONSTRAINT "PK_be58b2c68f80251dd78a4bb01c2" PRIMARY KEY ("key"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rvn_cca_token_caches"`);
  }
}
