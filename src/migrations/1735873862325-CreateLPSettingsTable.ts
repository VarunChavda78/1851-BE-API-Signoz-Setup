import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLpSettingsTable1704186000000 implements MigrationInterface {
    name = 'CreateLpSettingsTable1704186000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "lp_settings" (
                "id" SERIAL PRIMARY KEY,
                "brandId" INT NOT NULL,
                "status" BOOLEAN NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "createdBy" INT NOT NULL,
                "updatedBy" INT NOT NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "lp_settings"`);
    }
}
