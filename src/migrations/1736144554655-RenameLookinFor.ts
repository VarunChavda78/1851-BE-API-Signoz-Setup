import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameLookinFor1736144554655 implements MigrationInterface {
  name = 'RenameLookinFor1736144554655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "landing_page_leads" RENAME COLUMN "lookingfor" TO "lookingFor"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "landing_page_leads" RENAME COLUMN "lookingFor" TO "lookingfor"`,
    );
  }
}
