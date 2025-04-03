import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUnusedLandingTables1742465339891
  implements MigrationInterface
{
  name = 'RemoveUnusedLandingTables1742465339891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in an order that respects potential foreign key constraints
    // Usually child tables with foreign keys should be dropped before parent tables
    await queryRunner.query(`DROP TABLE IF EXISTS "landing_page_leads"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "landing_page_publish"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "landing_page_section"`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "landing_page_customisation"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "landing_page"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "landing_pages"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "landing_templates"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Need to define proper schema for down
  }
}
