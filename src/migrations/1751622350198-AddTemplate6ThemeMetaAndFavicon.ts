import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplate6ThemeMetaAndFavicon1751622350198
  implements MigrationInterface
{
  name = 'AddTemplate6ThemeMetaAndFavicon1751622350198';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
             (135,9, 'T6 Theme', 't6-theme'),
             (136,9, 'T6 Favicon', 't6-favicon'),
             (137,9, 'T6 Meta', 't6-meta')
            ON CONFLICT (id) DO NOTHING;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM lp_sections 
            WHERE id IN (135,136,137);
        `);
  }
}
