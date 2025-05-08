import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUnusedTables1746005047631 implements MigrationInterface {
  name = 'RemoveUnusedTables1746005047631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "landing_page"`);
    await queryRunner.query(`DROP TABLE "landing_page_customisation"`);
    await queryRunner.query(`DROP TABLE "landing_page_leads"`);
    await queryRunner.query(`DROP TABLE "landing_page_publish"`);
    await queryRunner.query(`DROP TABLE "landing_page_section"`);
    await queryRunner.query(`DROP TABLE "landing_pages"`);
    await queryRunner.query(`DROP TABLE "landing_templates"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
