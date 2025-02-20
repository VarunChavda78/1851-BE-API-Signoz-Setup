import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFavicon1740035675321 implements MigrationInterface {
  name = 'AddFavicon1740035675321';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
          VALUES 
          (70, 1, 'T1 Favicon', 't1-favicon'), 
          (71, 5, 'T2 Favicon', 't2-favicon'),
          (72, 6, 'T3 Favicon', 't3-favicon')
          ON CONFLICT (id) DO NOTHING;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM lp_sections WHERE id IN (70, 71, 72);
        `);
  }
}
