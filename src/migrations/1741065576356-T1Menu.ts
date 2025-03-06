import { MigrationInterface, QueryRunner } from "typeorm";

export class T1Menu1741065576356 implements MigrationInterface {
    name = 'T1Menu1741065576356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (75,1, 'T1 pageTitle', 't1-pageTitle') 
            ON CONFLICT (id) DO NOTHING;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (75);
          `);
    }

}
