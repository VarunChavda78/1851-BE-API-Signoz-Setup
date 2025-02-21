import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSettingsToLpSettings1740118250890
  implements MigrationInterface
{
  name = 'AddSettingsToLpSettings1740118250890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'lp_settings',
      new TableColumn({
        name: 'noOfPages',
        type: 'int',
        isNullable: false,
        default: 1,
      }),
    );

    await queryRunner.addColumn(
      'lp_settings',
      new TableColumn({
        name: 'templateConfig',
        type: 'json',
        isNullable: false,
        default: "'{}'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('lp_settings', 'noOfPages');
    await queryRunner.dropColumn('lp_settings', 'templateConfig');
  }
}
