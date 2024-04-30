import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeQuizQuestionsEntity21714493932683 implements MigrationInterface {
    name = 'ChangeQuizQuestionsEntity21714493932683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_questions" ALTER COLUMN "body" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ALTER COLUMN "correctAnswers" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_questions" ALTER COLUMN "correctAnswers" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quiz_questions" ALTER COLUMN "body" DROP NOT NULL`);
    }

}
