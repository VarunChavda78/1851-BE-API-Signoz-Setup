import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplate4SeoSection1747988338703 implements MigrationInterface {
  name = 'AddTemplate4SeoSection1747988338703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
                VALUES 
                (107,7, 'T4 Meta', 't4-meta')
                ON CONFLICT (id) DO NOTHING;
              `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                DELETE FROM lp_sections WHERE id = 107;
              `);
  }
}
