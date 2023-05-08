import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { getGrpcOptions } from './common/grpc/grpc-options';
import { protobufConfigure } from './common/grpc/protobuf-config';
import { getRabbitMQOptions } from './common/rabbitMQ/rabbitMQ-options';

protobufConfigure();

const protoPath = [
  join(__dirname, '..', 'protos/sample/sample.proto'),
  join(__dirname, '..', 'protos/sample/common.proto'),
  join(__dirname, '..', 'protos/sample/service.proto'),
];

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
