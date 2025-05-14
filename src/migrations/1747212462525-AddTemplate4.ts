import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTemplate41747212462525 implements MigrationInterface {
    name = 'AddTemplate41747212462525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                INSERT INTO lp_templates (id,"name", "createdBy", "updatedBy")
                 VALUES (4,'Template 4', 1, 1)
                 ON CONFLICT (id) DO NOTHING;
             `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`
            DELETE FROM lp_sections WHERE id IN (4);
          `);
    }

}
