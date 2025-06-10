import { MigrationInterface, QueryRunner } from "typeorm";

export class AddT5SectionSlug1749536602241 implements MigrationInterface {
    name = 'AddT5SectionSlug1749536602241'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
             (109,8, 'T5 Header', 't5-header'),
             (110,8, 'T5 Hero', 't5-hero'),
             (111,8, 'T5 Schedule Call', 't5-schedule-call'),
             (112,8, 'T5 Why Us', 't5-why-us'),
             (113,8, 'T5 Support/Process', 't5-support-process'),
             (114,8, 'T5 Section2', 't5-section2'),
             (115,8, 'T5 section2_1', 't5-section2_1'),
             (116,8, 'T5 Research', 't5-research'),
             (117,8, 'T5 Footer', 't5-footer'),
             (118,8, 'T5 Market Availability', 't5-market-availability'),
             (119,8, 'T5 Section Setting', 't5-section-setting')
            ON CONFLICT (id) DO NOTHING;
          `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
     await queryRunner.query(`
            DELETE FROM lp_sections 
            WHERE id IN (109,110,111,112,113,114,115,116,117,118,119);
        `);
    }

}
