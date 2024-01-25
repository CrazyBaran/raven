import { MigrationInterface, QueryRunner } from 'typeorm';

export class DomainsSeeding1706182011142 implements MigrationInterface {
  public name = 'DomainsSeeding1706182011142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO rvn_organisation_domains (organisation_id, domain)
    SELECT o.id, s.value
    FROM rvn_organisations o
    CROSS APPLY STRING_SPLIT(o.domains, ',') AS s
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM rvn_organisation_domains
    WHERE EXISTS (
        SELECT 1
        FROM rvn_organisations o
        WHERE rvn_organisation_domains.organisation_id = o.id
        AND ',' + o.domains + ',' LIKE '%,' + rvn_organisation_domains.domain + ',%'
    )
`);
  }
}
