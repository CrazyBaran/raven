import { MigrationInterface, QueryRunner } from 'typeorm';

export class StorageAccountFileEntityNullable1698222534914
  implements MigrationInterface
{
  public name = 'StorageAccountFileEntityNullable1698222534914';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_storage_account_files" DROP CONSTRAINT "FK_c8884ff2de3f1768463d85ecfc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_storage_account_files" ALTER COLUMN "updated_at" datetime2`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_storage_account_files" ALTER COLUMN "updated_by_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_storage_account_files" ADD CONSTRAINT "FK_c8884ff2de3f1768463d85ecfc4" FOREIGN KEY ("updated_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_storage_account_files" DROP CONSTRAINT "FK_c8884ff2de3f1768463d85ecfc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_storage_account_files" ALTER COLUMN "updated_by_id" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_storage_account_files" ALTER COLUMN "updated_at" datetime2 NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_storage_account_files" ADD CONSTRAINT "FK_c8884ff2de3f1768463d85ecfc4" FOREIGN KEY ("updated_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
