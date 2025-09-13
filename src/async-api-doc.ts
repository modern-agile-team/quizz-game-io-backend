import { INestApplication } from '@nestjs/common';

import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';

export class AsyncApiDocConfig {
  static async setup(app: INestApplication) {
    const asyncApiOptions = new AsyncApiDocumentBuilder()
      .setTitle('quizzes-game-io-backend')
      .setDescription(
        `The Quizzes Game IO Backend Async API<br>
이벤트 명은 {{scope}}.{{resource}}.{{action}}으로 규칙<br>
action은 created, changed, deleted 3가지만 사용.(추후 새로운 액션 정의가 필요하다면 설계 추가)<br>
ex) lobby.game_room.changed<br>
이벤트 페이로드의 action은 세부 액션임
        `,
      )
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
