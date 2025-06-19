import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLpGaReferralMetricsTable1750317533257 implements MigrationInterface {
    name = 'CreateLpGaReferralMetricsTable1750317533257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "lp_ga_referral_metrics" (
                "id" SERIAL NOT NULL,
                "date" DATE NOT NULL,
                "source" character varying(255) NOT NULL,
                "sessions" integer NOT NULL,
                "brandId" integer NOT NULL,
                "landingPageId" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_lp_ga_referral_metrics" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "lp_ga_referral_metrics" ADD CONSTRAINT "FK_lp_ga_referral_metrics_lp_pages_landingPageId"
            FOREIGN KEY ("landingPageId") REFERENCES "lp_pages"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_lp_ga_referral_metrics_date" ON "lp_ga_referral_metrics" ("date")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_lp_ga_referral_metrics_brandId" ON "lp_ga_referral_metrics" ("brandId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_lp_ga_referral_metrics_landingPageId" ON "lp_ga_referral_metrics" ("landingPageId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_lp_ga_referral_metrics_source" ON "lp_ga_referral_metrics" ("source")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_referral_metrics_source"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_referral_metrics_landingPageId"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_referral_metrics_brandId"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_lp_ga_referral_metrics_date"
        `);
        await queryRunner.query(`
            ALTER TABLE "lp_ga_referral_metrics" DROP CONSTRAINT "FK_lp_ga_referral_metrics_lp_pages_landingPageId"
        `);
        await queryRunner.query(`
            DROP TABLE "lp_ga_referral_metrics"
        `);
    }
}
