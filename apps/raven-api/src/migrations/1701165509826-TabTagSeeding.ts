import { TagTypeEnum } from '@app/rvns-tags';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { TabTagEntity } from '../app/api/rvn-tags/entities/tag.entity';

export class TabTagSeeding1701165509826 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tabs = await queryRunner.query(
      `SELECT rvn_tabs.*, rvn_templates.name as templateName
            FROM rvn_tabs
            INNER JOIN rvn_templates ON rvn_tabs.template_id = rvn_templates.id
            WHERE rvn_templates.type = 'workflow'`,
    );

    // Prepare the data for bulk insertion
    const tagsData = tabs.map((tab) => {
      const tabTag = new TabTagEntity();
      tabTag.name = tab.name;
      tabTag.tabId = tab.id;
      tabTag.type = TagTypeEnum.Tab;
      return tabTag;
    });

    await queryRunner.manager.save(TabTagEntity, tagsData);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM rvn_tags WHERE type = 'tab'`);
  }
}
