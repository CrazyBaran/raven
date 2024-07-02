import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpportunityCustomName1719876057119 implements MigrationInterface {
  public name = 'OpportunityCustomName1719876057119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "name" varchar(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "name"`,
    );
  }
}
