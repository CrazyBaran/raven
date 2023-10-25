import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToRootVersionId1698234839110
  implements MigrationInterface
{
  public name = 'AddIndexToRootVersionId1698234839110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_ca6c3778dbbed393aa909f5f94" ON "rvn_notes" ("root_version_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_ca6c3778dbbed393aa909f5f94" ON "rvn_notes"`,
    );
  }
}
