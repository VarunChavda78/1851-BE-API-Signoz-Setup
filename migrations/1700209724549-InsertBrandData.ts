import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertBrandData1700209724549 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      INSERT INTO brand (name, slug, logo, url)
      VALUES ('Laynes Chicken Fingers', 'layneschickenfingers', 'laynes-chicken.png', 'https://1851franchise.com/layneschickenfingers'), ('Mooyah', 'mooyah', 'mooyah.svg', 'https://1851franchise.com/mooyah'), ('Big Blue Swim School', 'bigblueswimschool', 'big-blue.svg', 'https://1851franchise.com/bigblueswimschool'), ('Workout Anytime', 'workoutanytime', 'workout.svg', 'https://1851franchise.com/workoutanytime'), ('Amazing Lash Studio', 'amazinglash', 'amazing-lash.png', 'https://1851franchise.com/amazinglash'), ('Anytime Fitness', 'anytimefitness', 'anytime-fitness.png', 'https://1851franchise.com/anytimefitness'), ('Joshua Tree Experts', 'joshuatreeexperts', 'joshua.jpeg', 'https://1851franchise.com/joshuatreeexperts'), ('Paris Baguette', 'parisbaguette', 'paris-baguette.svg', 'https://1851franchise.com/parisbaguette');
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      TRUNCATE TABLE category;
    `);
  }
}
