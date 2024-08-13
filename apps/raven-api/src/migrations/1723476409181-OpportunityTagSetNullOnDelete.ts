import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpportunityTagSetNullOnDelete1723476409181
  implements MigrationInterface
{
  public name = 'OpportunityTagSetNullOnDelete1723476409181';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "FK_789ea13616662b2a1f7827ddb59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD CONSTRAINT "FK_789ea13616662b2a1f7827ddb59" FOREIGN KEY ("tag_id") REFERENCES "rvn_tags"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "FK_789ea13616662b2a1f7827ddb59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD CONSTRAINT "FK_789ea13616662b2a1f7827ddb59" FOREIGN KEY ("tag_id") REFERENCES "rvn_tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
