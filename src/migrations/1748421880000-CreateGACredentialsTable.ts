// src/migrations/1748421880000-CreateGACredentialsTable.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGACredentialsTable1748421880000 implements MigrationInterface {
    name = 'CreateGACredentialsTable1748421880000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "ga_credentials" (
                "id" SERIAL NOT NULL,
                "brandId" integer NOT NULL,
                "propertyId" character varying,
                "accessToken" text NOT NULL,
                "refreshToken" text NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "landingPageId" integer,
                CONSTRAINT "PK_ga_credentials" PRIMARY KEY ("id")
            )
        `);
        
        await queryRunner.query(`
            ALTER TABLE "ga_credentials" ADD CONSTRAINT "FK_ga_credentials_lp_pages_landingPageId"
            FOREIGN KEY ("landingPageId") REFERENCES "lp_pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "ga_credentials" DROP CONSTRAINT "FK_ga_credentials_lp_pages_landingPageId"
        `);
        
        await queryRunner.query(`
            DROP TABLE "ga_credentials"
        `);
    }
}
