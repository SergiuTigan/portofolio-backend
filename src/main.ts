import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'node:fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/next.tigan.dev/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/next.tigan.dev/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://next.tigan.dev');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });

  await app.listen(443);
}

bootstrap();
