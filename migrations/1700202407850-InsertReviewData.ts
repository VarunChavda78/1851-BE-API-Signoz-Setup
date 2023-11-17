import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertReviewData1700202407850 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      INSERT INTO review (name, supplier_id, comment, rating, title, company)
      VALUES ('John Smith', 1, 'Test comment “You are always here on time, never leave early and adhere to all company break times.”
      “On the rare occasion that you have missed work, you have provided ample notice and made arrangements to ensure your responsibilities are covered.”', 3, 'Review for XX Commpany', 'Pearlthoughts'), ('Kiara', 1, 'Good', 4, 'Test title', 'Plts'), ('Saju', 96, 'You are always here on time, never leave early and adhere to all company break times.', 4, 'Review', 'XXXXX'), ('Sanda', 142, 'On the rare occasion that you have missed work, you have provided ample notice and made arrangements to ensure your responsibilities are covered.', 2, 'A performance evaluation is typically made up of several summaries, or comments, related to performance across several key competencies. As a manager, you can use these comments to offer clear examples of the successes and challenges of an employee. Providing thoughtful performance review comments can show your employees you are invested in their growth and development.', 'GPS');
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    await _queryRunner.query(`
      TRUNCATE TABLE review;
    `);
  }
}
