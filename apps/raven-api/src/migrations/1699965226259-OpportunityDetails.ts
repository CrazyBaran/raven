import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpportunityDetails1699965226259 implements MigrationInterface {
  public name = 'OpportunityDetails1699965226259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "round_size" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "valuation" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "proposed_investment" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "positioning" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "timing" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "under_nda" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" ADD "nda_termination_date" date`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "nda_termination_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "under_nda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "timing"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "positioning"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "proposed_investment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "valuation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_opportunities" DROP COLUMN "round_size"`,
    );
  }
}
