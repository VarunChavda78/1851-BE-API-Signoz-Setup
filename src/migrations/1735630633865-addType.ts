import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddType1735630633865 implements MigrationInterface {
  name = 'AddType1735630633865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE landing_page_leads ADD type int NOT NULL DEFAULT 1;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
