import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  
  // Security Headers
  app.use(helmet());

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  
  // Rate Limiting & Validation
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.warn('[CRITICAL] DATABASE_URL is missing in environment variables!');
  }

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on port: ${port}`);
}
bootstrap();
// Server reload trigger
