import { MigrationInterface, QueryRunner } from 'typeorm';

export class FundManagerLogoUrl1725364413096 implements MigrationInterface {
  public name = 'FundManagerLogoUrl1725364413096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" ADD "logo_url" nvarchar(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP COLUMN "logo_url"`,
    );
  }
}
