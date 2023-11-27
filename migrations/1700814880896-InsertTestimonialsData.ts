import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTestimonialsData1700814880896 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      INSERT INTO testimonial (name, designation, title, description, image)
      VALUES ('Richard Tetrick', 'Park Manger', 'We believe that Preston Construction offered the best value for the overhaul and new entrance for our building. We highly recommend Richard Preston and Preston Construction.', 'I have been with TN State parks for 10 years now and have experience with many different construction projects. I have worked with multiple contractors, but Preston Construction Company has been one of the best, if not the best that we have experience with. They were wonderful to work with and always kept us in the loop to everything that was going on. They attended construction meetings and always had accurate information. They also realized that in a state park we have to be flexible and creative with closures and dealing with the public. Preston Construction did a great job working with Roan Mountain State Park and the public, and they strived to complete quality work by set deadlines.', 'testimonial.png');
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      TRUNCATE TABLE testimonial;
    `);
  }
}
