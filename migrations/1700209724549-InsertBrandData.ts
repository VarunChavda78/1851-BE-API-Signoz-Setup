import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertBrandData1700209724549 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      INSERT INTO brand (name, logo, url)
      VALUES ("Layne's Chicken Fingers", 'laynes-chicken.png', 'https://1851franchise.com/layneschickenfingers'), ('Mooyah', 'mooyah.svg', 'https://1851franchise.com/mooyah'), ('Big Blue Swim School', 'big-blue.svg', 'https://1851franchise.com/bigblueswimschool'), ('Workout Anytime', 'workout.svg', 'https://1851franchise.com/workoutanytime'), ('Amazing Lash Studio', 'amazing-lash.png', 'https://1851franchise.com/amazinglash'), ('Anytime Fitness', 'anytime-fitness.png', 'https://1851franchise.com/anytimefitness'), ('Joshua Tree Experts', 'joshua.jpeg', 'https://1851franchise.com/joshuatreeexperts'), ('Paris Baguette', 'paris-baguette.svg', 'https://1851franchise.com/parisbaguette');
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      TRUNCATE TABLE category;
    `);
  }
}
