import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLandingMakeNameUnique1741689723394
  implements MigrationInterface
{
  name = 'UpdateLandingMakeNameUnique1741689723394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add a unique constraint to the 'name' column
    await queryRunner.query(
      `ALTER TABLE "lp_pages" ADD CONSTRAINT "UQ_lp_pages_name" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique constraint
    await queryRunner.query(
      `ALTER TABLE "lp_pages" DROP CONSTRAINT "UQ_lp_pages_name"`,
    );
  }
}
