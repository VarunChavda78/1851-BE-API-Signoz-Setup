import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTemplat4Page1747213198115 implements MigrationInterface {
    name = 'AddTemplat4Page1747213198115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                INSERT INTO lp_template_pages (id,"templateId", "name", "sequence","createdBy", "updatedBy")
                 VALUES (7, 4,'Home', 1, 1,1)
                 ON CONFLICT (id) DO NOTHING;
             `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM lp_template_pages WHERE id IN (7);
          `);
    }

}
