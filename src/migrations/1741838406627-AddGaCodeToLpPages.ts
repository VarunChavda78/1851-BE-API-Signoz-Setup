import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddGaCodeToLpPages1740120000000 implements MigrationInterface {
  name = 'AddGaCodeToLpPages1740120000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'lp_pages',
      new TableColumn({
        name: 'gaCode',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('lp_pages', 'gaCode');
  }
}