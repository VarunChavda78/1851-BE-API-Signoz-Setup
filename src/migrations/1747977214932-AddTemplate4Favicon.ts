import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplate4Favicon1747977214932 implements MigrationInterface {
  name = 'AddTemplate4Favicon1747977214932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (106,7, 'T4 Favicon', 't4-favicon')
            ON CONFLICT (id) DO NOTHING;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM lp_sections WHERE id = 106;
          `);
  }
}
