import { MigrationInterface, QueryRunner } from 'typeorm';

export class StorageAccountFileEntity1698159981549
  implements MigrationInterface
{
  public name = 'StorageAccountFileEntity1698159981549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rvn_storage_account_files" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_f3331bafe92f73b56476c0dade1" DEFAULT NEWSEQUENTIALID(), "original_file_name" nvarchar(256) NOT NULL, "note_root_version_id" uniqueidentifier, "created_by_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_c2908604e99810c9c632d7ec562" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_7c684d27358a25215500562011a" DEFAULT getdate(), "updated_by_id" uniqueidentifier NOT NULL, CONSTRAINT "PK_f3331bafe92f73b56476c0dade1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_542da8a8fc42d3405535aa1955" ON "rvn_storage_account_files" ("created_by_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7c684d27358a25215500562011" ON "rvn_storage_account_files" ("updated_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c8884ff2de3f1768463d85ecfc" ON "rvn_storage_account_files" ("updated_by_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_storage_account_files" ADD CONSTRAINT "FK_542da8a8fc42d3405535aa19557" FOREIGN KEY ("created_by_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "rvn_storage_account_files" DROP CONSTRAINT "FK_542da8a8fc42d3405535aa19557"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_c8884ff2de3f1768463d85ecfc" ON "rvn_storage_account_files"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_7c684d27358a25215500562011" ON "rvn_storage_account_files"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_542da8a8fc42d3405535aa1955" ON "rvn_storage_account_files"`,
    );
    await queryRunner.query(`DROP TABLE "rvn_storage_account_files"`);
  }
}
