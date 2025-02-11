import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLpCrmForm1739274100285 implements MigrationInterface {
  name = 'CreateLpCrmForm1739274100285';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lp_form',
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
          },
          {
            name: 'lpId',
            type: 'int',
          },
          {
            name: 'content',
            type: 'text',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('lp_form');
  }
}
