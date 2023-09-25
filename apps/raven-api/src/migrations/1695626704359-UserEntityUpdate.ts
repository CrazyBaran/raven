import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEntityUpdate1695626704359 implements MigrationInterface {
  public name = 'UserEntityUpdate1695626704359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_cf41cd1b62089ce20c60acaf04" ON "rvn_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" DROP CONSTRAINT "DF_046edefcf366e813528f9fde3cb"`,
    );
    await queryRunner.query(`ALTER TABLE "rvn_users" DROP COLUMN "activated"`);
    await queryRunner.query(
      `ALTER TABLE "rvn_users" DROP COLUMN "activation_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" DROP CONSTRAINT "DF_5cd45bf89200a3d0ed9a00189bd"`,
    );
    await queryRunner.query(`ALTER TABLE "rvn_users" DROP COLUMN "suspended"`);
    await queryRunner.query(
      `ALTER TABLE "rvn_users" DROP COLUMN "suspension_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" DROP CONSTRAINT "DF_bffe357fecdf3886e84998046da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" DROP COLUMN "session_invalidated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" ADD "azure_id" nvarchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8df6d95528460217984eda4354" ON "rvn_users" ("id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_8df6d95528460217984eda4354" ON "rvn_users"`,
    );
    await queryRunner.query(`ALTER TABLE "rvn_users" DROP COLUMN "azure_id"`);
    await queryRunner.query(
      `ALTER TABLE "rvn_users" ADD "session_invalidated" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" ADD CONSTRAINT "DF_bffe357fecdf3886e84998046da" DEFAULT 0 FOR "session_invalidated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" ADD "suspension_date" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" ADD "suspended" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" ADD CONSTRAINT "DF_5cd45bf89200a3d0ed9a00189bd" DEFAULT 0 FOR "suspended"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" ADD "activation_date" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" ADD "activated" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_users" ADD CONSTRAINT "DF_046edefcf366e813528f9fde3cb" DEFAULT 0 FOR "activated"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_cf41cd1b62089ce20c60acaf04" ON "rvn_users" ("id", "activated", "suspended", "session_invalidated") `,
    );
  }
}
