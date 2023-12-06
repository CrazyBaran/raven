import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganisationSharepointDirectoryId1701861182771
  implements MigrationInterface
{
  public name = 'OrganisationSharepointDirectoryId1701861182771';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" ADD "sharepoint_directory_id" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" DROP COLUMN "sharepoint_directory_id"`,
    );
  }
}
