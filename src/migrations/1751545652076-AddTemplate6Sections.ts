import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplate6Sections1751545652076 implements MigrationInterface {
  name = 'AddTemplate6Sections1751545652076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (124,9, 'T6 Header', 't6-header'),
            (125,9, 'T6 Hero', 't6-hero'),
            (126,9, 'T6 Schedule Call', 't6-schedule-call'),
            (127,9, 'T6 Section 0', 't6-section-0'),
            (128,9, 'T6 Section 1', 't6-section-1'),
            (129,9, 'T6 Section 2', 't6-section-2'),
            (130,9, 'T6 Team', 't6-team'),
            (131,9, 'T6 Faq', 't6-faq'),
            (132,9, 'T6 Research', 't6-research'),
            (133,9, 'T6 Footer', 't6-footer'),
            (134,9, 'T6 Section Setting', 't6-section-setting')
            ON CONFLICT (id) DO NOTHING;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (124,125,126,127,128,129,130,131,132,133,134);
          `);
  }
}
