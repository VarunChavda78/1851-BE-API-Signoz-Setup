import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1709799237078 implements MigrationInterface {
    name = 'Migrations1709799237078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "university" ("id" SERIAL NOT NULL, "heading" character varying NOT NULL, "url" character varying NOT NULL, "image" character varying, "pdf" character varying, "type" integer NOT NULL, "created_by" integer, "updated_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d14e5687dbd51fd7a915c22ac13" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "university"`);
    }

}
