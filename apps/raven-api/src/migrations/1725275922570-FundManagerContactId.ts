import { MigrationInterface, QueryRunner } from 'typeorm';

export class FundManagerContactId1725275922570 implements MigrationInterface {
  public name = 'FundManagerContactId1725275922570';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" ADD "id" uniqueidentifier NOT NULL CONSTRAINT "DF_2a86f20f79dfe772c5605d172aa" DEFAULT NEWSEQUENTIALID()`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" DROP CONSTRAINT "PK_84a7200bf286e6a794cd0cc30f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" ADD CONSTRAINT "PK_a4a71761e473212bc85d1268e29" PRIMARY KEY ("fund_manager_id", "id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" DROP CONSTRAINT "PK_a4a71761e473212bc85d1268e29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" ADD CONSTRAINT "PK_84a7200bf286e6a794cd0cc30f1" PRIMARY KEY ("fund_manager_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" DROP COLUMN "id"`,
    );
  }
}
