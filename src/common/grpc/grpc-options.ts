import { GrpcOptions, Transport } from '@nestjs/microservices';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 50051;

const URL = `${HOST}:${PORT}`;

export const getGrpcOptions = (
  serviceName: string,
  protoPath: string[],
): GrpcOptions => ({
  transport: Transport.GRPC,
  options: {
    package: serviceName,
    url: URL,
    protoPath,
  },
});

export const getGrpcTestingOptions = (
  packageName: string,
  protoPath: string[],
): GrpcOptions => ({
  transport: Transport.GRPC,
  options: {
    url: URL,
    package: packageName,
    protoPath,
  },
});
