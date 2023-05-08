import { RmqOptions, Transport } from '@nestjs/microservices';

const RABBITMQ_URL = 'amqp://localhost:5672';

export const getRabbitMQOptions = (queue: string): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [RABBITMQ_URL],
    queue,
    queueOptions: {
      durable: false,
    },
  },
});
