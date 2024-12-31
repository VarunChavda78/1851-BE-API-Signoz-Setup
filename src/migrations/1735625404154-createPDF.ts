import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePDF1735625404154 implements MigrationInterface {
  name = 'CreatePDF1735625404154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const lpSectionExists = await queryRunner.hasTable('lp_pdf');
    if (!lpSectionExists) {
      await queryRunner.createTable(
        new Table({
          name: 'lp_pdf',
          columns: [
            {
              name: 'id',
              type: 'serial',
              isPrimary: true,
            },
            {
              name: 'brandId',
              type: 'int',
              isNullable: false,
            },
            {
              name: 'email',
              type: 'varchar',
              length: '255',
              isNullable: false,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
