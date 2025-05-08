import { MigrationInterface, QueryRunner } from "typeorm";

export class AddT1MarketAvailability1746645175411 implements MigrationInterface {
    name = 'AddT1MarketAvailability1746645175411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (88,1, 'T1 Market Availability', 't1-market-availability')
            ON CONFLICT (id) DO NOTHING;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (88);
          `);
    }

}
