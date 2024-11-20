import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIsNewVersion1732103866088 implements MigrationInterface {
    public name = 'UpdateIsNewVersion1732103866088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE rvn_notes
                                 SET is_newest_version = 1
                                 WHERE version = (SELECT MAX("note_sub"."version") AS "maxVersion"
                                                  FROM "rvn_notes" "note_sub"
                                                  WHERE LOWER("note_sub"."root_version_id") = LOWER(rvn_notes."root_version_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}

}
