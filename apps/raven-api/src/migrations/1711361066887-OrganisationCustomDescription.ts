import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganisationCustomDescription1711361066887
  implements MigrationInterface
{
  public name = 'OrganisationCustomDescription1711361066887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" ADD "custom_description" nvarchar(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" DROP COLUMN "custom_description"`,
    );
  }
}
