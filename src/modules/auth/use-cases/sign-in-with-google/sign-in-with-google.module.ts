import { Module } from '@nestjs/common';

import { GoogleAuthGuard } from '@module/auth/guards/google-auth.guard';
import { AuthTokenModule } from '@module/auth/services/auth-token/auth-token.module';
import { GoogleStrategy } from '@module/auth/strategy/google.strategy';
import { SignInWithGoogleController } from '@module/auth/use-cases/sign-in-with-google/sign-in-with-google.controller';
import { SignInWithGoogleHandler } from '@module/auth/use-cases/sign-in-with-google/sign-in-with-google.handler';

import { AppConfigModule } from '@common/app-config/app-config.module';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [AuthTokenModule, EventStoreModule, AppConfigModule],
  controllers: [SignInWithGoogleController],
  providers: [SignInWithGoogleHandler, GoogleAuthGuard, GoogleStrategy],
})
export class SignInWithGoogleModule {}
