import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddT5RemainingSectionSlug1750330907752
  implements MigrationInterface
{
  name = 'AddT5RemainingSectionSlug1750330907752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
             (121,8, 'T5 Theme', 't5-theme'),
             (122,8, 'T5 Favicon', 't5-favicon'),
             (123,8, 'T5 Meta', 't5-meta')
            ON CONFLICT (id) DO NOTHING;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM lp_sections 
            WHERE id IN (121,122,123);
        `);
  }
}
