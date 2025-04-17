import { MigrationInterface, QueryRunner } from "typeorm";

export class AddT3SectionSettings1744885145331 implements MigrationInterface {
    name = 'AddT3SectionSettings1744885145331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (76,6, 'T3 Section Settings', 't3-section-settings') 
            ON CONFLICT (id) DO NOTHING;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (76);
          `);
    }

}
