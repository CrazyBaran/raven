import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpportunityCreationDate1698927105711
  implements MigrationInterface
{
  public name = 'OpportunityCreationDate1698927105711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "created_at" datetime2 NOT NULL CONSTRAINT "DF_0ab62cb9414d4c852fdf0e6d74a" DEFAULT getdate()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP CONSTRAINT "DF_0ab62cb9414d4c852fdf0e6d74a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "created_at"`,
    );
  }
}
