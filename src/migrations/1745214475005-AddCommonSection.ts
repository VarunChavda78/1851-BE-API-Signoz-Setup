import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCommonSection1745214475005 implements MigrationInterface {
  name = 'AddCommonSection1745214475005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (77,1, 'T1 P1 Common', 't1p1-common'),
            (78,2, 'T1 P2 Common', 't1p2-common'),
            (79,3, 'T1 P3 Common', 't1p3-common'),
            (80,4, 'T1 P4 Common', 't1p4-common'),
            (81,5, 'T2 Common', 't2-common'),
            (82,6, 'T3 Common', 't3-common')
            ON CONFLICT (id) DO NOTHING;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (77,78,79,80,81,82);
          `);
  }
}
