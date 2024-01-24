import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterDomainsType1706019349010 implements MigrationInterface {
  public name = 'AlterDomainsType1706019349010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" ALTER COLUMN "domains" NVARCHAR(1024) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" ALTER COLUMN "domains" NTEXT NOT NULL`,
    );
  }
}
