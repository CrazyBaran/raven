import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganisationCustomDescriptionUpdatedAt1711441424711
  implements MigrationInterface
{
  public name = 'OrganisationCustomDescriptionUpdatedAt1711441424711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" ADD "custom_description_updated_at" datetime2`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_organisations" DROP COLUMN "custom_description_updated_at"`,
    );
  }
}
