import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexesForPerformance1732108328838 implements MigrationInterface {
    public name = 'IndexesForPerformance1732108328838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_8b70d3e1471d5ecfeabf855cc4" ON "rvn_notes" ("deleted_at", "is_newest_version", "name") WHERE deleted_at is null AND is_newest_version = 1`);
        await queryRunner.query(`CREATE INDEX "IDX_b5e82b0ad48fbb480991895263" ON "rvn_notes" ("deleted_at", "is_newest_version", "updated_at") WHERE deleted_at is null AND is_newest_version = 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_b5e82b0ad48fbb480991895263" ON "rvn_notes"`);
        await queryRunner.query(`DROP INDEX "IDX_8b70d3e1471d5ecfeabf855cc4" ON "rvn_notes"`);
    }

}
