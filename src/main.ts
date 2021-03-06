import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger set up
  // swagger options
  const swag_options = new DocumentBuilder()
    .setTitle('JCC clothes API')
    .setDescription('Backend API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  // swagger create document
  const swag_document = SwaggerModule.createDocument(app, swag_options);
  SwaggerModule.setup('api', app, swag_document);

  app.enableCors();
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
