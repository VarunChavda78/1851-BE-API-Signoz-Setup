import { MigrationInterface, QueryRunner } from "typeorm";

export class AddT1SectionSetting1745399046660 implements MigrationInterface {
    name = 'AddT1SectionSetting1745399046660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (84,1, 'T1 P1 Section Settings', 't1p1-section-settings'),
            (85,2, 'T1 P2 Section Settings', 't1p2-section-settings'),
            (86,3, 'T1 P3 Section Settings', 't1p3-section-settings'),
            (87,4, 'T1 P4 Section Settings', 't1p4-section-settings') 
            ON CONFLICT (id) DO NOTHING;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (84,85,86,87);
          `);
        }

}
