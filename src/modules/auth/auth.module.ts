import { Module } from '@nestjs/common';

import { SignInWithGoogleModule } from '@module/auth/use-cases/sign-in-with-google/sign-in-with-google.module';
import { SignInWithUsernameModule } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.module';
import { SignUpWithUsernameModule } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.module';

@Module({
  imports: [
    SignInWithGoogleModule,
    SignUpWithUsernameModule,
    SignInWithUsernameModule,
  ],
})
export class AuthModule {}
