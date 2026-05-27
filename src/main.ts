import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as net from 'net';
import { AppModule } from './app.module';

async function findAvailablePort(startPort: number): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    const isFree = await new Promise<boolean>((resolve) => {
      const tester = net.createServer();
      tester.once('error', () => resolve(false));
      tester.once('listening', () => tester.close(() => resolve(true)));
      tester.listen(port, '::');
    });

    if (isFree) return port;
  }

  throw new Error('No available port found');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = await findAvailablePort(Number(process.env.PORT ?? 3000));
  await app.listen(port);
}
bootstrap();
