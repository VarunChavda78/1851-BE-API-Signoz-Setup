import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPartialUniqueIndexToLpPage1748255739150
  implements MigrationInterface
{
  name = 'AddPartialUniqueIndexToLpPage1748255739150';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing unique indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_lp_pages_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_lp_pages_nameSlug"`);

    // Create partial unique indexes that only apply to non-deleted records
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_lp_pages_name" ON public.lp_pages (name) WHERE "deletedAt" IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_lp_pages_nameSlug" ON public.lp_pages ("nameSlug") WHERE "deletedAt" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert back to standard unique indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_lp_pages_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_lp_pages_nameSlug"`);

    // Recreate regular unique indexes without the WHERE condition
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_lp_pages_name" ON public.lp_pages (name)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_lp_pages_nameSlug" ON public.lp_pages ("nameSlug")`,
    );
  }
}
