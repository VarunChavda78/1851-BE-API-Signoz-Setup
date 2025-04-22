import { MigrationInterface, QueryRunner } from "typeorm";

export class AddT2SectionSetting1745218989097 implements MigrationInterface {
    name = 'AddT2SectionSetting1745218989097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (83,5, 'T2 Section Settings', 't2-section-settings') 
            ON CONFLICT (id) DO NOTHING;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (83);
          `);
    }

}
