import { MigrationInterface, QueryRunner } from 'typeorm';

export class DroppedTagIndex1701435226608 implements MigrationInterface {
  public name = 'DroppedTagIndex1701435226608';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_5a3b257e9c2c09d40808b1d59b" ON "rvn_tags"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5a3b257e9c2c09d40808b1d59b" ON "rvn_tags" ("name", "type") `,
    );
  }
}
