import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddThemeSectionSlug1736403733781 implements MigrationInterface {
  name = 'AddThemeSectionSlug1736403733781';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
      VALUES 
      (66, 1, 'T1 Theme', 't1-theme'), 
      (67, 5, 'T2 Theme', 't2-theme'),
      (68, 6, 'T3 Theme', 't3-theme')
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM lp_sections WHERE id IN (66, 67, 68);
    `);
  }
}
