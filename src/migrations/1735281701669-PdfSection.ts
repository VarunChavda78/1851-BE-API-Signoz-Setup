import { MigrationInterface, QueryRunner } from 'typeorm';

export class PdfSection1735281701669 implements MigrationInterface {
  name = 'PdfSection1735281701669';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO lp_sections (id,"lpTemplatePageId", name, slug)
            VALUES 
            (55,4,'Download PDF', 't2-download-pdf')
            ON CONFLICT (slug) DO NOTHING;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
