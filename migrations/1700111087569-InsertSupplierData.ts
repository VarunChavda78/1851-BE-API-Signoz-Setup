import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSupplierData1700111087569 implements MigrationInterface {
  constructor() {}
  public async up(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      INSERT INTO category (name)
      VALUES ('Accounting'), ('Banking/Financing'), ('Brokers'), ('Consulting/Development'), ('Events'), ('Legal'), ('Marketing'), ('Merchant Services'), ('Other Technology'), ('Public Relations'), ('Real Estate');
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      DELETE FROM category WHERE name = Accounting;
      DELETE FROM category WHERE name = Banking/Financing;
      DELETE FROM category WHERE name = Brokers;
      DELETE FROM category WHERE name = Consulting/Development;
      DELETE FROM category WHERE name = Events;
      DELETE FROM category WHERE name = Legal;
      DELETE FROM category WHERE name = Marketing;
      DELETE FROM category WHERE name = Merchant Services;
      DELETE FROM category WHERE name = Other Technology;
      DELETE FROM category WHERE name = Public Relations;
      DELETE FROM category WHERE name = Real Estate;
    `);
  }
}
