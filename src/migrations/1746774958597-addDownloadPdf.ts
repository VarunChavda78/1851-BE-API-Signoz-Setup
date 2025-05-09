import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDownloadPdf1746774958597 implements MigrationInterface {
    name = 'AddDownloadPdf1746774958597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO lp_sections (id, "lpTemplatePageId", name, slug)
            VALUES 
            (89,2, 'T1 P2 Download Pdf', 't1p2-download-pdf'),
            (90,3, 'T1 P3 Download Pdf', 't1p3-download-pdf'),
            (91,4, 'T1 P4 Download Pdf', 't1p4-download-pdf')
            ON CONFLICT (id) DO NOTHING;
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (89,90,91);
          `);
    }

}
