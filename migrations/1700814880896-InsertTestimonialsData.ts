import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTestimonialsData1700814880896 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      INSERT INTO testimonial (name, designation, title, description, image)
      VALUES ('MARK MELE', 'CDO, Edible Brands', '', 'More so than an extension of our team, 1851 and Mainland are a part of our team…. Whatever goals that we want to obtain, they are there to help us out…. I think that’s what makes it a special relationship. They have a vested interest in the brand.', 'testimonial-mark-male.png');
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      TRUNCATE TABLE testimonial;
    `);
  }
}
