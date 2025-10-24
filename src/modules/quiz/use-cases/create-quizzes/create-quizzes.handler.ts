import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { Quiz } from '@module/quiz/entities/quiz.entity';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';
import { CreateQuizzesCommand } from '@module/quiz/use-cases/create-quizzes/create-quizzes.command';

import { AppConfigService } from '@common/app-config/app-config.service';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateQuizzesCommand)
export class CreateQuizzesHandler
  implements ICommandHandler<CreateQuizzesCommand, Quiz[]>
{
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepositoryPort,
    @Inject(QUIZ_IMAGE_REPOSITORY)
    private readonly quizImageRepository: QuizImageRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Transactional()
  async execute(command: CreateQuizzesCommand): Promise<Quiz[]> {
    const { props } = command;

    const quizImageFileNames = props
      .map((item) => item.imageUrl)
      .filter((url): url is string => url !== null)
      .filter((url) =>
        url.startsWith(
          `${this.appConfigService.get('AWS_S3_URL')}/quiz-images`,
        ),
      )
      .map((url) => this.extractFileNameFromUrl(url));

    const quizImages =
      quizImageFileNames.length > 0
        ? await this.quizImageRepository.findByFileNames(quizImageFileNames)
        : [];

    const quizzes = props
      .filter((item) => {
        if (item.imageUrl === null) {
          return true;
        }

        return quizImages.some(
          (quizImage) =>
            quizImage.fileName ===
            this.extractFileNameFromUrl(item.imageUrl as string),
        );
      })
      .map((item) =>
        Quiz.create({
          type: item.type,
          answer: item.answer,
          question: item.question,
          imageUrl: item.imageUrl,
        }),
      );

    await this.quizRepository.insertMany(quizzes);

    await Promise.all(
      quizzes.map((quiz) => this.eventStore.storeAggregateEvents(quiz)),
    );

    return quizzes;
  }

  /**
   * @todo 퀴즈 이미지의 url과 filaName에 대한 규칙을 퀴즈 이미지 모듈에서 관리하도록 변경
   */
  private extractFileNameFromUrl(url: string): string {
    return url.split('/').pop() as string;
  }
}
