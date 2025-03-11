import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('/etc/letsencrypt/live/api.tigan.dev/privkey.pem'),
  //   cert: fs.readFileSync('/etc/letsencrypt/live/api.tigan.dev/cert.pem'),
  // };

  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
  });
  app.use((req, res, next) => {
    const allowedOrigins = ['https://next.tigan.dev', 'http://localhost:4200'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
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
