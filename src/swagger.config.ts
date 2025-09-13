import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Y-AML')
  .setDescription('API documentation')
  .setVersion('1.0.0')
  .addTag('api')
  .build();