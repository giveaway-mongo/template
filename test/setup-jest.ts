import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app/app.module';
import { getGrpcTestingOptions } from '../src/common/grpc/grpc-options';
import { join } from 'path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { isTestEnvironment } from '../src/common/utils/environment';
import { getRabbitMQOptions } from '../src/common/rabbitMQ/rabbitMQ-options';

const protoPath = [
  join(__dirname, '..', 'protos/sample/sample.proto'),
  join(__dirname, '..', 'protos/sample/common.proto'),
  join(__dirname, '..', 'protos/sample/service.proto'),
];

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

  app = await testingModule.createNestApplication();

  app.connectMicroservice(getGrpcTestingOptions('sample', protoPath));

  app.connectMicroservice(getRabbitMQOptions('new_queue'));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.startAllMicroservices();
  await app.init();
  await app.listen(3001);

  (global as any).app = app;
  (global as any).testingModule = testingModule;

  await execAsync('pnpm test:db-push');
});

afterAll(async () => {
  await app.close();
});

afterEach(async () => {
  await execAsync('pnpm test:db-push');
}, 30000);
