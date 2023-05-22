import { RmqOptions, Transport } from '@nestjs/microservices';

const HOST = process.env.RABBITMQ_HOST || 'localhost';
const PORT = process.env.RABBITMQ_PORT || '5672';
const USERNAME = process.env.RABBITMQ_USERNAME || 'guest';
const PASSWORD = process.env.RABBITMQ_PASSWORD || 'guest';

const RABBITMQ_URL = `amqp://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`;

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
