import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDomainsColumn1706187449132 implements MigrationInterface {
  public name = 'RemoveDomainsColumn1706187449132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" DROP COLUMN "domains"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" ADD "domains" nvarchar(1024) NOT NULL`,
    );
  }
}
