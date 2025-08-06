import { AsyncApiDocConfig } from 'src/async-api-doc';
import {
  createApp,
  setGlobalExceptionFilter,
  setGlobalInterceptor,
  setGlobalPipe,
  setLogger,
  setWebSocket,
} from 'src/bootstrap';
import { SwaggerConfig } from 'src/swagger';

async function bootstrap() {
  const app = await createApp();

  setGlobalPipe(app);
  setLogger(app);
  setGlobalInterceptor(app);
  setGlobalExceptionFilter(app);
  SwaggerConfig.setup(app);
  app.enableShutdownHooks();
  await setWebSocket(app);
  await AsyncApiDocConfig.setup(app);

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () => {
    console.info(`Server listening on port ${PORT}`);
  });
}
bootstrap();
