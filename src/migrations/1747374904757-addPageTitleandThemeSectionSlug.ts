import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPageTitleandThemeSectionSlug1747374904757
  implements MigrationInterface
{
  name = 'AddPageTitleandThemeSectionSlug1747374904757';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (104,7, 'T4 Theme', 't4-theme'),
            (105,7, 'T4 pageTitle', 't4-pageTitle')
            ON CONFLICT (id) DO NOTHING;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (104,105);
          `);
  }
}
