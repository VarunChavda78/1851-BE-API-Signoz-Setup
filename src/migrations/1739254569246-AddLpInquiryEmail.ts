import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddLpInquiryEmail1739254569246 implements MigrationInterface {
  name = 'AddLpInquiryEmail1739254569246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lp_inquiry',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'lpId',
            type: 'int',
          },
          {
            name: 'brandId',
            type: 'int',
          },
          {
            name: 'email',
            type: 'text',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('lp_inquiry');
  }
}
