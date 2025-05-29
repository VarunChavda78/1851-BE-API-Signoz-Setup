// src/migrations/1748421900000-CreateLpGaSyncStatusTable.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLpGaSyncStatusTable1748421900000 implements MigrationInterface {
    name = 'CreateLpGaSyncStatusTable1748421900000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "lp_ga_sync_status" (
                "id" SERIAL NOT NULL,
                "brandId" integer NOT NULL,
                "landingPageId" integer,
                "lastSynced" TIMESTAMP,
                "lastSyncStatus" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_lp_ga_sync_status" PRIMARY KEY ("id")
            )
        `);
        
        await queryRunner.query(`
            ALTER TABLE "lp_ga_sync_status" ADD CONSTRAINT "FK_lp_ga_sync_status_lp_pages_landingPageId"
            FOREIGN KEY ("landingPageId") REFERENCES "lp_pages"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);
        
        // Add unique constraint to prevent duplicate entries
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_lp_ga_sync_status_brand_page" ON "lp_ga_sync_status" ("brandId", "landingPageId")
            WHERE "landingPageId" IS NOT NULL
        `);
        
        // Add index for brandId only entries
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_lp_ga_sync_status_brand_null" ON "lp_ga_sync_status" ("brandId")
            WHERE "landingPageId" IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_sync_status_brand_null"
        `);
        
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_sync_status_brand_page"
        `);
        
        await queryRunner.query(`
            ALTER TABLE "lp_ga_sync_status" DROP CONSTRAINT "FK_lp_ga_sync_status_lp_pages_landingPageId"
        `);
        
        await queryRunner.query(`
            DROP TABLE "lp_ga_sync_status"
        `);
    }
}
