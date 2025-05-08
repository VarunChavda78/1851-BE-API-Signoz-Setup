import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUnusedTables1746005047631 implements MigrationInterface {
  name = 'RemoveUnusedTables1746005047631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'landing_page',
      'landing_page_customisation',
      'landing_page_leads',
      'landing_page_publish',
      'landing_page_section',
      'landing_pages',
      'landing_templates',
    ];

    for (const table of tables) {
      const exists = await queryRunner.hasTable(table);
      if (exists) {
        await queryRunner.query(`DROP TABLE "${table}"`);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}