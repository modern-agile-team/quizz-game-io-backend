import { INestApplication } from '@nestjs/common';

import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

export class AsyncApiDocConfig {
  static async setup(app: INestApplication) {
    const asyncApiOptions = new AsyncApiDocumentBuilder()
      .setTitle('quizzes-game-io-backend')
      .setDescription('The Quizzes Game IO Backend Async API')
      .setVersion('0.1')
      .setDefaultContentType('application/json')
      .build();

    const asyncapiDocument = await AsyncApiModule.createDocument(
      app,
      asyncApiOptions,
    );
    await AsyncApiModule.setup('async-doc', app, asyncapiDocument);
  }
}
