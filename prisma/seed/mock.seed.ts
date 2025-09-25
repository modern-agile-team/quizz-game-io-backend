import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { TSID } from 'tsid-ts';

const prisma = new PrismaClient();

const mockQuizzes = JSON.parse(
  readFileSync(`${__dirname}/contents/quiz-mock.json`, 'utf-8'),
);

async function main() {
  await prisma.quiz.createMany({
    data: mockQuizzes.map((quiz) => {
      return {
        id: TSID.create().number.toString(),
        type: quiz.type,
        imageUrl: quiz.imageUrl,
        question: quiz.question,
        answer: quiz.answer,
      };
    }),
  });
}

main()
  .then(() => {
    console.log(`${mockQuizzes.length}개의 Mock Quiz 생성 완료`);
  })
  .catch(async (e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
