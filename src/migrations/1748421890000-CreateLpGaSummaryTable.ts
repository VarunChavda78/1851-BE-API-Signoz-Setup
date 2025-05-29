// src/migrations/1748421890000-CreateLpGaSummaryTable.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLpGaSummaryTable1748421890000 implements MigrationInterface {
    name = 'CreateLpGaSummaryTable1748421890000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "lp_ga_summary" (
                "id" SERIAL NOT NULL,
                "date" DATE NOT NULL,
                "pageViews" integer NOT NULL,
                "sessions" integer NOT NULL,
                "sessionDuration" integer NOT NULL,
                "avgSessionDuration" float NOT NULL,
                "users" integer NOT NULL,
                "bounceRate" float NOT NULL,
                "brandId" integer NOT NULL,
                "landingPageId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_lp_ga_summary" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "lp_ga_summary" ADD CONSTRAINT "FK_lp_ga_summary_lp_pages_landingPageId"
            FOREIGN KEY ("landingPageId") REFERENCES "lp_pages"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);
        
        // Add index for faster queries
        await queryRunner.query(`
            CREATE INDEX "IDX_lp_ga_summary_date" ON "lp_ga_summary" ("date")
        `);
        
        await queryRunner.query(`
            CREATE INDEX "IDX_lp_ga_summary_brandId" ON "lp_ga_summary" ("brandId")
        `);
        
        await queryRunner.query(`
            CREATE INDEX "IDX_lp_ga_summary_landingPageId" ON "lp_ga_summary" ("landingPageId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_summary_landingPageId"
        `);
        
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_summary_brandId"
        `);
        
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_summary_date"
        `);
        
        await queryRunner.query(`
            ALTER TABLE "lp_ga_summary" DROP CONSTRAINT "FK_lp_ga_summary_lp_pages_landingPageId"
        `);
        
        await queryRunner.query(`
            DROP TABLE "lp_ga_summary"
        `);
    }
}
