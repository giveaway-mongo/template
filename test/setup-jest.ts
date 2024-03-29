import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/modules/app/app.module';
import { getGrpcTestingOptions } from '@common/grpc/grpc-options';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { isTestEnvironment } from '@common/utils/environment';
import { getRabbitMQOptions } from '@common/rabbitMQ/rabbitMQ-options';
import { protoPath } from '@src/constants/proto-path';

const execAsync = promisify(exec);

let app: INestApplication;
let testingModule: TestingModule;

jest.setTimeout(10000);

global.beforeAll(async () => {
  if (!isTestEnvironment()) {
    throw Error('Not testing environment!');
  }

  testingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = await testingModule
    .createNestApplication()
    .useGlobalPipes(new ValidationPipe({ transform: true }));

  app.connectMicroservice(getGrpcTestingOptions('sample', protoPath), {
    inheritAppConfig: true,
  });

  app.connectMicroservice(getRabbitMQOptions('new_queue'), {
    inheritAppConfig: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.startAllMicroservices();

  (global as any).app = app;
  (global as any).testingModule = testingModule;

  await execAsync('pnpm test:db-push');
});

global.afterAll(async () => {
  await app.close();
});

global.afterEach(async () => {
  await execAsync('pnpm test:db-push');
}, 15000);
