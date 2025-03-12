import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLandingAddNameSlug1741690235176
  implements MigrationInterface
{
  name = 'UpdateLandingAddNameSlug1741690235176';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add the new nameSlug column
    await queryRunner.query(
      `ALTER TABLE "lp_pages" ADD "nameSlug" character varying(255)`,
    );

    // 2. Generate slugs from existing name values:
    // - Convert to lowercase
    // - Replace spaces and special characters with hyphens
    // - Remove multiple consecutive hyphens
    // - Remove leading and trailing hyphens
    await queryRunner.query(`
            UPDATE "lp_pages" 
            SET "nameSlug" = LOWER(
                REGEXP_REPLACE(
                    REGEXP_REPLACE(
                        REGEXP_REPLACE(
                            "name",
                            '[^a-zA-Z0-9\\s]', '-', 'g'
                        ),
                        '\\s+', '-', 'g'
                    ),
                    '-+', '-', 'g'
                )
            )
        `);

    // 3. Remove leading and trailing hyphens that might be left
    await queryRunner.query(`
            UPDATE "lp_pages" 
            SET "nameSlug" = REGEXP_REPLACE(REGEXP_REPLACE("nameSlug", '^-+', ''), '-+$', '')
        `);

    // 4. Make the column NOT NULL now that we've populated it
    await queryRunner.query(
      `ALTER TABLE "lp_pages" ALTER COLUMN "nameSlug" SET NOT NULL`,
    );

    // 5. Add a unique constraint
    await queryRunner.query(
      `ALTER TABLE "lp_pages" ADD CONSTRAINT "UQ_lp_pages_nameSlug" UNIQUE ("nameSlug")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop the unique constraint
    await queryRunner.query(
      `ALTER TABLE "lp_pages" DROP CONSTRAINT "UQ_lp_pages_nameSlug"`,
    );

    // 2. Drop the column
    await queryRunner.query(`ALTER TABLE "lp_pages" DROP COLUMN "nameSlug"`);
  }
}
