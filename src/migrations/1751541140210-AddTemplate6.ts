import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplate61751541140210 implements MigrationInterface {
  name = 'AddTemplate61751541140210';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO lp_templates (id,"name", "createdBy", "updatedBy")
                VALUES (6,'Template 6', 1, 1)
                ON CONFLICT (id) DO NOTHING;
            `);
    await queryRunner.query(`
            INSERT INTO lp_template_pages (id,"templateId", "name", "sequence","createdBy", "updatedBy")
                VALUES (9, 6,'Home', 1, 1, 1)
                ON CONFLICT (id) DO NOTHING;
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM lp_templates WHERE id IN (6);
          `);
    await queryRunner.query(`
            DELETE FROM lp_template_pages WHERE id IN (9);
          `);
  }
}
