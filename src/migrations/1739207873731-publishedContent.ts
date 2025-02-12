import { MigrationInterface, QueryRunner,TableColumn } from "typeorm";

export class PublishedContent1739207873731 implements MigrationInterface {
    name = 'PublishedContent1739207873731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE lp_customisation ADD COLUMN "publishedContent" JSON NOT NULL DEFAULT '{}'`,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE lp_customisation DROP COLUMN "publishedContent";`
        );
    }

}
