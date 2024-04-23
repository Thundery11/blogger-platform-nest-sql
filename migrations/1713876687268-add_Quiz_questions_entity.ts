import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuizQuestionsEntity1713876687268 implements MigrationInterface {
    name = 'AddQuizQuestionsEntity1713876687268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quiz_questions" ("id" SERIAL NOT NULL, "body" character varying, "correctAnswers" jsonb, "published" boolean NOT NULL DEFAULT false, "createdAt" character varying NOT NULL, "updatedAt" character varying, CONSTRAINT "PK_ec0447fd30d9f5c182e7653bfd3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "quiz_questions"`);
    }

}
