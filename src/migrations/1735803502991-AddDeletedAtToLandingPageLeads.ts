import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtToLandingPageLeads1735803502991
  implements MigrationInterface
{
  name = 'AddDeletedAtToLandingPageLeads1735803502991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "landing_page_leads" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "landing_page_leads" DROP COLUMN "deletedAt"`,
    );
  }
}
