import { MigrationInterface, QueryRunner } from "typeorm";

export class AddT4SectionSlug1747217970752 implements MigrationInterface {
    name = 'AddT4SectionSlug1747217970752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (92,7, 'T4 Header', 't4-header'),
            (93,7, 'T4 Hero', 't4-hero'),
            (94,7, 'T4 Schedule Call', 't4-schedule-call'),
            (95,7, 'T4 Why Us', 't4-why-us'),
            (96,7, 'T4 How We Stand', 't4-how-we-stand'),
            (97,7, 'T4 Meet The Team', 't4-meet-the-team'),
            (98,7, 'T4 Investment', 't4-investment'),
            (99,7, 'T4 Growing', 't4-growing'),
            (100,7, 'T4 Testimonials', 't4-testimonials'),
            (101,7, 'T4 Research', 't4-research'),
            (102,7, 'T4 Footer', 't4-footer'),
            (103,7, 'T4 Section Setting', 't4-section-setting')
            ON CONFLICT (id) DO NOTHING;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (92,93,94,95,96,97,98,99,100,101,102,103);
          `);
    }

}
