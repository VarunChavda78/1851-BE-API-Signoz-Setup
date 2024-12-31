import { MigrationInterface, QueryRunner } from "typeorm";

export class LookingFor1735633589194 implements MigrationInterface {
    name = 'LookingFor1735633589194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE landing_page_leads ADD lookingFor int NOT NULL DEFAULT 1;`,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
