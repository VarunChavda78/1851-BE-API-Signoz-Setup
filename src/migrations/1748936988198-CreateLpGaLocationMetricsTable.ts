import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLpGaLocationMetricsTable1748936988198 implements MigrationInterface {
    name = 'CreateLpGaLocationMetricsTable1748936988198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "lp_ga_location_metrics" (
                "id" SERIAL NOT NULL,
                "date" DATE NOT NULL,
                "city" character varying(255) NOT NULL,
                "country" character varying(255) NOT NULL,
                "state" character varying(255) NOT NULL,
                "pageViews" integer NOT NULL,
                "sessions" integer NOT NULL,
                "sessionDuration" float NOT NULL,
                "avgSessionDuration" float NOT NULL,
                "users" integer NOT NULL,
                "latitude" float DEFAULT 0,
                "longitude" float DEFAULT 0,
                "brandId" integer NOT NULL,
                "landingPageId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_lp_ga_location_metrics" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "lp_ga_location_metrics" ADD CONSTRAINT "FK_lp_ga_location_metrics_lp_pages_landingPageId"
            FOREIGN KEY ("landingPageId") REFERENCES "lp_pages"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);
        
        // Add indexes for faster queries
        await queryRunner.query(`
            CREATE INDEX "IDX_lp_ga_location_metrics_date" ON "lp_ga_location_metrics" ("date")
        `);
        
        await queryRunner.query(`
            CREATE INDEX "IDX_lp_ga_location_metrics_brandId" ON "lp_ga_location_metrics" ("brandId")
        `);
        
        await queryRunner.query(`
            CREATE INDEX "IDX_lp_ga_location_metrics_landingPageId" ON "lp_ga_location_metrics" ("landingPageId")
        `);
        
        await queryRunner.query(`
            CREATE INDEX "IDX_lp_ga_location_metrics_city_country" ON "lp_ga_location_metrics" ("city", "country")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_location_metrics_city_country"
        `);
        
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_location_metrics_landingPageId"
        `);
        
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_location_metrics_brandId"
        `);
        
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_location_metrics_date"
        `);
        
        await queryRunner.query(`
            ALTER TABLE "lp_ga_location_metrics" DROP CONSTRAINT "FK_lp_ga_location_metrics_lp_pages_landingPageId"
        `);
        
        await queryRunner.query(`
            DROP TABLE "lp_ga_location_metrics"
        `);
    }
}
