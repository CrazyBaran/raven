import { ShortlistType } from 'rvns-shared';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { ShortlistEntity } from '../app/api/rvn-shortlists/entities/shortlist.entity';

export class PersonalListsCreate1708611325718 implements MigrationInterface {
  public name = 'PersonalListsCreate1708611325718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await queryRunner.query(`SELECT id, name from rvn_users`);

    for (const user of users) {
      const listExists = await queryRunner.manager.findOne(ShortlistEntity, {
        where: {
          type: ShortlistType.PERSONAL,
          creatorId: user.id,
        },
      });
      if (listExists) {
        console.warn(
          `List found for user ${user.name} ${user.id}, NOT adding, continue.`,
        );
        continue;
      }

      await queryRunner.manager.save(
        queryRunner.manager.create<ShortlistEntity>(ShortlistEntity, {
          name: `${user.name} Personal list`,
          description: `Personal shortlist of user ${user.name}`,
          creatorId: user.id,
          type: ShortlistType.PERSONAL,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM rvn_shortlist WHERE type = 'personal'`,
    );
  }
}
