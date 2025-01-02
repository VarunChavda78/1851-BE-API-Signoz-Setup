import { MigrationInterface, QueryRunner } from "typeorm";

export class LookingFor1735841711434 implements MigrationInterface {
    name = 'LookingFor1735841711434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE landing_page_leads ADD lookingFor varchar NOT NULL;`,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
