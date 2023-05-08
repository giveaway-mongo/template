import { GrpcOptions, Transport } from '@nestjs/microservices';

export const getGrpcOptions = (
  serviceName: string,
  protoPath: string[],
): GrpcOptions => ({
  transport: Transport.GRPC,
  options: {
    package: serviceName,
    url: `${process.env.HOST || 'localhost'}:${process.env.PORT || 50051}`,
    protoPath,
  },
});

export const getGrpcTestingOptions = (
  packageName: string,
  protoPath: string[],
): GrpcOptions => ({
  transport: Transport.GRPC,
  options: {
    url: 'localhost:50051',
    package: packageName,
    protoPath,
  },
});
