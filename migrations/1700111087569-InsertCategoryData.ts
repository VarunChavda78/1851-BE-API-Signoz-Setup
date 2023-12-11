import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertCategoryData1700111087569 implements MigrationInterface {
  constructor() {}
  public async up(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      INSERT INTO category (name)
      VALUES ('Accounting'), ('Banking / Financing'), ('Brokers'), ('Consulting / Development'), ('Events'), ('Legal'), ('Marketing'), ('Merchant Services'), ('Other Technology'), ('Public Relations'), ('Real Estate');
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      TRUNCATE TABLE category;
    `);
  }
}
