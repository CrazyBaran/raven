import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganisationInitialDataSource1709455781179
  implements MigrationInterface
{
  public name = 'OrganisationInitialDataSource1709455781179';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" ADD "initial_data_source" varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" DROP COLUMN "initial_data_source"`,
    );
  }
}
