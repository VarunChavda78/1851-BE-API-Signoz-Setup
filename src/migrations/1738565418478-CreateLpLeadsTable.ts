import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateLpLeadsTable1738565418478 implements MigrationInterface {
  name = 'CreateLpLeadsTable1738565418478';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lp_leads',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'brandId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'lpId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'uid',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'field',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'formType',
            type: 'int',
            default: 1,
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'lp_leads',
      new TableIndex({
        name: 'IDX_LP_LEADS_UID',
        columnNames: ['uid'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('lp_leads', 'IDX_LP_LEADS_UID');

    await queryRunner.dropTable('lp_leads');
  }
}
