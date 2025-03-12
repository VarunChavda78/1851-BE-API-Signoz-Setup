import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLandingPageName1741688422250 implements MigrationInterface {
  name = 'UpdateLandingPageName1741688422250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "lp_pages" SET "name" = CONCAT("name", ' ', "id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Note: It's impossible to revert the name changes automatically as the original data is lost
  }
}
