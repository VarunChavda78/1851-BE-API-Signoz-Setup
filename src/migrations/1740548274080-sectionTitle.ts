import { MigrationInterface, QueryRunner } from "typeorm";

export class SectionTitle1740548274080 implements MigrationInterface {
    name = 'SectionTitle1740548274080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (73, 5, 'T2 SectionTitle', 't2-sectionTitle'), 
            (74, 6, 'T3 SectionTitle', 't3-sectionTitle')
            ON CONFLICT (id) DO NOTHING;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (73,74);
          `);
    }

}
