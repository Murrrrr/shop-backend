import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 활성화
  app.enableCors({ origin: '*' });

  // 유효성 검증 파이프
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('쇼핑몰 API')
    .setDescription('가상 쇼핑몰 백엔드 API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(4000);
  console.log('쇼핑몰 API 서버: http://localhost:4000');
  console.log('Swagger 문서: http://localhost:4000/api-docs');
}
bootstrap();
