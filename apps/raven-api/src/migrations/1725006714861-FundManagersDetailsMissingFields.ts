import { MigrationInterface, QueryRunner } from 'typeorm';

export class FundManagersDetailsMissingFields1725006714861
  implements MigrationInterface
{
  public name = 'FundManagersDetailsMissingFields1725006714861';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" ADD "domain" nvarchar(512)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" ADD "avg_check_size_currency" nvarchar(3) CONSTRAINT CHK_64510a064f9e6c237bfc922bd6_ENUM CHECK(avg_check_size_currency IN ('USD','GBP','EUR','AED'))`,
    );
    await queryRunner.query(`ALTER TABLE "rvn_fund_manager" ADD "aum" bigint`);
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" ADD "aum_currency" nvarchar(3) CONSTRAINT CHK_868894b6828ed428343028de9d_ENUM CHECK(aum_currency IN ('USD','GBP','EUR','AED'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" ADD "is_portfolio" bit NOT NULL CONSTRAINT "DF_a9c1988c147b800557266af642f" DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP COLUMN "avg_check_size"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" ADD "avg_check_size" bigint`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP COLUMN "avg_check_size"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" ADD "avg_check_size" nvarchar(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP CONSTRAINT "DF_a9c1988c147b800557266af642f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP COLUMN "is_portfolio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP COLUMN "aum_currency"`,
    );
    await queryRunner.query(`ALTER TABLE "rvn_fund_manager" DROP COLUMN "aum"`);
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP COLUMN "avg_check_size_currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager" DROP COLUMN "domain"`,
    );
  }
}
