import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { RequestContextModule } from 'nestjs-request-context';

import { AppGateway } from 'src/app.gateway';

import { AccountModule } from '@module/account/account.module';
import { AuthModule } from '@module/auth/auth.module';
import { GameRoomModule } from '@module/game-room/game-room.module';
import { ImageModule } from '@module/image/image.module';
import { NicknameSourceModule } from '@module/nickname-source/nickname-source.module';
import { QuizModule } from '@module/quiz/quiz.module';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import { LoggerModule } from '@shared/logger/logger.module';
import { PrismaModule } from '@shared/prisma/prisma.module';

import { AccountSocketIndexStoreModule } from '@core/socket/index-store/account-socket-index.store.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    RequestContextModule,
    AppConfigModule,
    LoggerModule,
    PrismaModule,
    AccountSocketIndexStoreModule,
    ClsModuleFactory(),

    AccountModule,
    AuthModule,
    GameRoomModule,
    ImageModule,
    NicknameSourceModule,
    QuizModule,
  ],
  providers: [AppGateway],
})
export class AppModule {}
