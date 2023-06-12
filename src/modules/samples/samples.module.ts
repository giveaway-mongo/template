import { Module } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { SamplesController } from './samples.controller';
import { PrismaModule } from '@src/prisma/prisma.module';
import { ClientsModule } from '@nestjs/microservices';
import { getRabbitMQOptions } from '@common/rabbitMQ/rabbitMQ-options';

@Module({
  controllers: [SamplesController],
  providers: [SamplesService],
  imports: [
    PrismaModule,
    // That is just for testing rabbitmq. There should be no client here
    ClientsModule.register([
      {
        name: 'sample-service',
        ...getRabbitMQOptions('new_queue'),
      },
    ]),
  ],
})
export class SamplesModule {}
