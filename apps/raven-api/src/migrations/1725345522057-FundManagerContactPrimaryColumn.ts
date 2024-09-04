import { MigrationInterface, QueryRunner } from 'typeorm';

export class FundManagerContactPrimaryColumn1725345522057
  implements MigrationInterface
{
  public name = 'FundManagerContactPrimaryColumn1725345522057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" DROP CONSTRAINT "FK_84a7200bf286e6a794cd0cc30f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" DROP CONSTRAINT "PK_a4a71761e473212bc85d1268e29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" ADD CONSTRAINT "PK_2a86f20f79dfe772c5605d172aa" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" ADD CONSTRAINT "FK_84a7200bf286e6a794cd0cc30f1" FOREIGN KEY ("fund_manager_id") REFERENCES "rvn_fund_manager"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" DROP CONSTRAINT "FK_84a7200bf286e6a794cd0cc30f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" DROP CONSTRAINT "PK_2a86f20f79dfe772c5605d172aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" ADD CONSTRAINT "PK_a4a71761e473212bc85d1268e29" PRIMARY KEY ("fund_manager_id", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_fund_manager_contact" ADD CONSTRAINT "FK_84a7200bf286e6a794cd0cc30f1" FOREIGN KEY ("fund_manager_id") REFERENCES "rvn_fund_manager"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
