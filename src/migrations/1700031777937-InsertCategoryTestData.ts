import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertCategoryTestData1700031777937 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO suppliers (name)
      VALUES (Accounting), (Banking/Financing), (Brokers), (Consulting/Development), (Events), (Legal), (Marketing), (Merchant Services), (Other Technology), (Public Relations), (Real Estate);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM suppliers WHERE name = Accounting AND name = Banking/Financing AND name = Brokers AND name = Consulting/Development AND name = Events AND name = Legal AND name = Marketing AND name = Merchant Services AND name = Other Technology AND name = Public Relations AND name = Real Estate;
    `);
  }
}
