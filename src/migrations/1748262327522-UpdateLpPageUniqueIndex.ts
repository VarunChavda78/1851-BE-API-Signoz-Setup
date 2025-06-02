import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLpPageUniqueIndex1748262327522
  implements MigrationInterface
{
  name = 'UpdateLpPageUniqueIndex1748262327522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing unique constraints (not just indexes)
    await queryRunner.query(
      `ALTER TABLE "lp_pages" DROP CONSTRAINT IF EXISTS "UQ_lp_pages_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lp_pages" DROP CONSTRAINT IF EXISTS "UQ_lp_pages_nameSlug"`,
    );

    // Also drop any existing indexes with the same names (if they still exist)
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
    // Drop the partial indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_lp_pages_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_lp_pages_nameSlug"`);

    // Recreate standard unique constraints
    await queryRunner.query(
      `ALTER TABLE "lp_pages" ADD CONSTRAINT "UQ_lp_pages_name" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lp_pages" ADD CONSTRAINT "UQ_lp_pages_nameSlug" UNIQUE ("nameSlug")`,
    );
  }
}
