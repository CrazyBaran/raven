import { ShortlistType } from 'rvns-shared';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { ShortlistEntity } from '../app/api/rvn-shortlists/entities/shortlist.entity';

export class MubadalaShortlistCreate1708693152244
  implements MigrationInterface
{
  public name = 'MubadalaShortlistCreate1708693152244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      queryRunner.manager.create(ShortlistEntity, {
        name: 'Mubadala Shortlist',
        description:
          'List containing everything that is in any other Shortlist',
        creatorId: null,
        type: ShortlistType.MAIN,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM rvn_shortlist WHERE type = 'main'`);
  }
}
