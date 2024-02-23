import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShortlistNullableCreatorMubadalaType1708693118035
  implements MigrationInterface
{
  public name = 'ShortlistNullableCreatorMubadalaType1708693118035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" DROP CONSTRAINT "FK_fd575b6fa9a699b2220bbb5d047"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" DROP CONSTRAINT "CHK_bfd6d8ad5301f767376f577eec_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" ADD CONSTRAINT "CHK_5f30d34545b575c1a91741cccc_ENUM" CHECK (type IN ('personal','custom','main'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" ALTER COLUMN "creator_id" uniqueidentifier`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" ADD CONSTRAINT "FK_fd575b6fa9a699b2220bbb5d047" FOREIGN KEY ("creator_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" DROP CONSTRAINT "FK_fd575b6fa9a699b2220bbb5d047"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" ALTER COLUMN "creator_id" uniqueidentifier NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" ADD CONSTRAINT "CHK_bfd6d8ad5301f767376f577eec_ENUM" CHECK (type IN ('personal','custom'))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" DROP CONSTRAINT "CHK_5f30d34545b575c1a91741cccc_ENUM"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rvn_shortlist" ADD CONSTRAINT "FK_fd575b6fa9a699b2220bbb5d047" FOREIGN KEY ("creator_id") REFERENCES "rvn_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
