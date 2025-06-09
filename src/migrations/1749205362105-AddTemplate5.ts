import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplate51749205362105 implements MigrationInterface {
  name = 'AddTemplate51749205362105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO lp_templates (id,"name", "createdBy", "updatedBy")
                VALUES (5,'Template 5', 1, 1)
                ON CONFLICT (id) DO NOTHING;
            `);
    await queryRunner.query(`
            INSERT INTO lp_template_pages (id,"templateId", "name", "sequence","createdBy", "updatedBy")
                VALUES (8, 5,'Home', 1, 1, 1)
                ON CONFLICT (id) DO NOTHING;
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM lp_templates WHERE id IN (5);
          `);
    await queryRunner.query(`
            DELETE FROM lp_template_pages WHERE id IN (8);
          `);
  }
}
