import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getGrpcOptions } from '@common/grpc/grpc-options';
import { protobufConfigure } from '@common/grpc/protobuf-config';
import { getRabbitMQOptions } from '@common/rabbitMQ/rabbitMQ-options';
import { protoPath } from './constants/proto-path';
import { ValidationPipe } from '@nestjs/common';
import {
  RpcExceptionFilter,
  ServerExceptionFilter,
} from '@common/utils/rpc-exception.filter';

protobufConfigure();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ServerExceptionFilter());
  app.useGlobalFilters(new RpcExceptionFilter());

  app.connectMicroservice<MicroserviceOptions>(
    getGrpcOptions('sample', protoPath),
    { inheritAppConfig: true },
  );

  app.connectMicroservice<MicroserviceOptions>(
    getRabbitMQOptions('new_queue'),
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap();
