import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRoleData1703659098350 implements MigrationInterface {
  constructor() {}
  public async up(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      INSERT INTO role (name)
      VALUES ('Super admin'), ('Admin'), ('Author'), ('Brand User'), ('Supplier');
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      TRUNCATE TABLE role;
    `);
  }
}
