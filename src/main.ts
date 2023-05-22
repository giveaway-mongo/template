import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getGrpcOptions } from '@common/grpc/grpc-options';
import { protobufConfigure } from '@common/grpc/protobuf-config';
import { getRabbitMQOptions } from '@common/rabbitMQ/rabbitMQ-options';
import { protoPath } from './constants/proto-path';

protobufConfigure();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(
    getGrpcOptions('sample', protoPath),
  );

  app.connectMicroservice<MicroserviceOptions>(getRabbitMQOptions('new_queue'));

  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap();
