import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpportunityVersionTags1706106265922 implements MigrationInterface {
  public name = 'OpportunityVersionTags1706106265922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "version_tag_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" ADD "opportunity_tag_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD CONSTRAINT "FK_10cd65b50b49157becb45352573" FOREIGN KEY ("version_tag_id") REFERENCES "rvn_tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" ADD CONSTRAINT "FK_fe58334dcee9bd317a31f651134" FOREIGN KEY ("opportunity_tag_id") REFERENCES "rvn_tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" DROP CONSTRAINT "FK_fe58334dcee9bd317a31f651134"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "FK_10cd65b50b49157becb45352573"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_tags" DROP COLUMN "opportunity_tag_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "version_tag_id"`,
    );
  }
}
