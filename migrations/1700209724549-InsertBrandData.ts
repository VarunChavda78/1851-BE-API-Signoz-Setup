import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertBrandData1700209724549 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      INSERT INTO brand (name, slug, logo)
      VALUES ('Laynes Chicken Fingers', 'layneschickenfingers', 'laynes-chicken.png'), ('Mooyah', 'mooyah', 'mooyah.svg'), ('Big Blue Swim School', 'bigblueswimschool', 'big-blue.svg'), ('Workout Anytime', 'workoutanytime', 'workout.svg'), ('Amazing Lash Studio', 'amazinglash', 'amazing-lash.png'), ('Anytime Fitness', 'anytimefitness', 'anytime-fitness.png'), ('Joshua Tree Experts', 'joshuatreeexperts', 'joshua.jpeg'), ('Paris Baguette', 'parisbaguette', 'paris-baguette.svg');
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      TRUNCATE TABLE category;
    `);
  }
}
