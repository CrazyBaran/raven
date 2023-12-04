import { MigrationInterface, QueryRunner } from 'typeorm';

export class SharepointDirectoryIdInOpportunity1701696004052
  implements MigrationInterface
{
  public name = 'SharepointDirectoryIdInOpportunity1701696004052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "sharepoint_directory_id" nvarchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "sharepoint_directory_id"`,
    );
  }
}
