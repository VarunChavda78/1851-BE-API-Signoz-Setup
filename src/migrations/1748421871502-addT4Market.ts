import { MigrationInterface, QueryRunner } from "typeorm";

export class AddT4Market1748421871502 implements MigrationInterface {
    name = 'AddT4Market1748421871502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (108,7, 'T4 Market Availability', 't4-market-availability')
            ON CONFLICT (id) DO NOTHING;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (108);
          `);
    }

}
