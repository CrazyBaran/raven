import { MigrationInterface, QueryRunner } from 'typeorm';

export class CcaTokenCacheIsEncrypted1698754577010
  implements MigrationInterface
{
  public name = 'CcaTokenCacheIsEncrypted1698754577010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_cca_token_caches" ADD "is_encrypted" bit NOT NULL CONSTRAINT "DF_6716c3263ea593141e2adcb823e" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_cca_token_caches" DROP CONSTRAINT "DF_6716c3263ea593141e2adcb823e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_cca_token_caches" DROP COLUMN "is_encrypted"`,
    );
  }
}
