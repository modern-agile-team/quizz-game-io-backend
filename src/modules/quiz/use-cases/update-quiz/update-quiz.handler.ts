import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import {
  IMAGE_REPOSITORY,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';
import { Quiz } from '@module/quiz/entities/quiz.entity';
import { QuizImageNotFoundError } from '@module/quiz/errors/quiz-image-not-found.error';
import { QuizNotFoundError } from '@module/quiz/errors/quiz-not-found.error';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';
import { UpdateQuizCommand } from '@module/quiz/use-cases/update-quiz/update-quiz.command';

import { AppConfigService } from '@common/app-config/app-config.service';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(UpdateQuizCommand)
export class UpdateQuizHandler
  implements ICommandHandler<UpdateQuizCommand, Quiz>
{
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepositoryPort,
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Transactional()
  async execute(command: UpdateQuizCommand): Promise<Quiz> {
    const quiz = await this.quizRepository.findOneById(command.quizId);

    if (quiz === undefined) {
      throw new QuizNotFoundError();
    }

    await this.validateImageUrl(command.imageUrl);

    quiz.update({
      type: command.type,
      question: command.question,
      answer: command.answer,
      imageUrl: command.imageUrl,
    });

    await this.quizRepository.update(quiz);

    await this.eventStore.storeAggregateEvents(quiz);

    return quiz;
  }

  /**
   * @todo image의 url과 filaName에 대한 규칙을 이미지 모듈에서 관리하도록 변경
   */
  private async validateImageUrl(url?: string | null): Promise<void> {
    if (url === undefined || url === null) {
      return;
    }

    if (
      url.startsWith(`${this.appConfigService.get('AWS_S3_URL')}/images`) ===
      false
    ) {
      throw new QuizImageNotFoundError();
    }

    const quizImages = await this.imageRepository.findByFileNames([
      url.split('/').pop() as string,
    ]);

    if (quizImages.length === 0) {
      throw new QuizImageNotFoundError();
    }
  }
}
