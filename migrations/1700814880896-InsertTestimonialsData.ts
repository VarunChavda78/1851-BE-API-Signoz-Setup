import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTestimonialsData1700814880896 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      INSERT INTO testimonial (name, designation, title, description, image)
      VALUES ('John Smith', 'Co-Founder Fitness Premier', 'I get the information I want in one easy place. Worth every penny.', 'Lorem ipsum dolor sit amet consectetur. Sem viverra sed ipsum tortor bibendum vestibulum ullamcorper vitae ullamcorper. Mi id cras risus cursus cursus malesuada. Eget sed scelerisque tristique quam vitae amet. Bibendum velit eget blandit pharetra at felis lorem risus. Gravida viverra tempor odio in tortor massa ut tristique. Interdum tempor id at nibh mauris. Gravida vel pellentesque feugiat donec. Neque eros dui pharetra id urna faucibus at varius fermentum. Neque facilisi fringilla adipiscing amet in eu proin.', 'testimonial.svg');
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      TRUNCATE TABLE testimonial;
    `);
  }
}
