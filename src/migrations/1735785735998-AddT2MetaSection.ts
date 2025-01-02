import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddT2MetaSection1704185600000 implements MigrationInterface {
  name = 'AddT2MetaSection1704185600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
      VALUES (54, 5, 'T2 Meta', 't2-meta')
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM lp_sections WHERE id = 54;
    `);
  }
}
