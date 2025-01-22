import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtToLpPdf1737538960695 implements MigrationInterface {
    name = 'AddDeletedAtToLpPdf1737538960695'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `ALTER TABLE "lp_pdf" ADD "deletedAt" TIMESTAMP DEFAULT NULL`
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `ALTER TABLE "lp_pdf" DROP COLUMN "deletedAt"`
        );
      }
}
