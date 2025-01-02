import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddT3Sections1704185600001 implements MigrationInterface {
  name = 'AddT3Sections1704185600001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
      VALUES 
      (56, 6, 'T3 Form', 't3-form') 
      (57, 6, 'T3 Header', 't3-header'),
      (58, 6, 'T3 Hero', 't3-hero'),
      (59, 6, 'T3 Quick Facts', 't3-quickFacts'),
      (60, 6, 'T3 Franchising 101', 't3-franchising101'),
      (61, 6, 'T3 What Client Are Saying', 't3-whatClientAreSaying'),
      (62, 6, 'T3 Why Us', 't3-why-us'),
      (63, 6, 'T3 Footer', 't3-footer'),
      (64, 6, 'T3 Meta', 't3-meta'),
      (65, 6, 'T3 Download PDF', 't3-download-pdf')
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM lp_sections WHERE id IN (56, 57, 58, 59, 60, 61, 62, 63, 64, 65);
    `);
  }
}
