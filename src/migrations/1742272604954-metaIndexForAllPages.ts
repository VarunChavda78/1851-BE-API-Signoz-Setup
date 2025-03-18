import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class MetaIndexForAllPages1742272604954 implements MigrationInterface {
  name = 'MetaIndexForAllPages1742272604954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'lp_pages',
      new TableColumn({
        name: 'metaIndex',
        type: 'boolean',
        isNullable: false,
        default: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('lp_pages', 'metaIndex');
  }
}
