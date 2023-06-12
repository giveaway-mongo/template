import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ, RpcException } from '@nestjs/microservices';
import { PrismaService } from '../../prisma/prisma.service';
import { getListOptions } from '@common/utils/list-params';
import { SampleCreateRequest } from './dto/create-sample.dto';
import { SampleUpdateRequest } from './dto/update-sample.dto';
import { Prisma, Sample } from '@prisma/generated';
import { SampleListRequest } from './dto/list-sample.dto';
import { generateGuid } from '@common/utils/generate-guid';
import { WithError } from '@common/types/utils';
import { SampleEvent } from './dto/broker.dto';
import { getErrors, getFieldErrors } from '@common/utils/error';
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  ERROR_TYPES,
} from '@common/constants/error';

@Injectable()
export class SamplesService {
  constructor(
    private prisma: PrismaService,
    @Inject('sample-service') private client: ClientRMQ,
  ) {}

  async create(
    sample: SampleCreateRequest,
  ): Promise<WithError<{ result: Sample }>> {
    let fieldErrors = [];

    if (!sample.title) {
      fieldErrors = getFieldErrors(
        [
          {
            location: ['title'],
            message: ERROR_MESSAGES.EMPTY,
            type: ERROR_TYPES.EMPTY,
          },
        ],
        fieldErrors,
      );
    }

    if (!sample.text) {
      fieldErrors = getFieldErrors(
        [
          {
            location: ['text'],
            message: ERROR_MESSAGES.EMPTY,
            type: ERROR_TYPES.EMPTY,
          },
        ],
        fieldErrors,
      );
    }

    if (fieldErrors.length) {
      throw new RpcException(
        getErrors({ fieldErrors, errorCode: ERROR_CODES.BAD_REQUEST }),
      );
    }

    const sampleToCreate: Prisma.SampleCreateInput = {
      guid: generateGuid(),
      title: sample.title,
      text: sample.text,
    };

    const result = await this.prisma.sample.create({
      data: sampleToCreate,
    });

    // RabbitMQ event is sent here
    // look at protos/broker/sample/sample.proto for more info
    this.client.emit<any, SampleEvent>('sample.sample.add', {
      guid: result.guid,
      title: result.title,
      text: result.text,
      isActive: result.isActive,
      isDeleted: result.isDeleted,
      createdAt: result.createdAt.toString(),
      updatedAt: result.updatedAt.toString(),
    });

    return { result, errors: null };
  }

  async update(
    guid: string,
    sample: SampleUpdateRequest,
  ): Promise<WithError<{ result: Sample }>> {
    if (!guid) {
      // Error without any fields. NonFieldError example
      // look into rpc-exception.filter.ts file. There is RpcExceptionFilter,
      // which handles all RpcException objects
      throw new RpcException('No guid is provided.');
    }

    const result = await this.prisma.sample.update({
      data: sample,
      where: {
        guid,
      },
    });

    // RabbitMQ event is sent here
    // look at protos/broker/sample/sample.proto for more info
    this.client.emit<any, SampleEvent>('sample.sample.add', {
      guid: result.guid,
      title: result.title,
      text: result.text,
      isActive: result.isActive,
      isDeleted: result.isDeleted,
      createdAt: result.createdAt.toString(),
      updatedAt: result.updatedAt.toString(),
    });

    return { result, errors: null };
  }

  async list(
    listRequest: SampleListRequest,
  ): Promise<WithError<{ results: Sample[]; count: number }>> {
    const { skip, orderBy, where, take } = getListOptions<
      Prisma.SampleWhereInput,
      Prisma.SampleOrderByWithRelationInput
    >(listRequest.options);

    const [count, results] = await this.prisma.$transaction([
      this.prisma.sample.count(),
      this.prisma.sample.findMany({
        skip,
        orderBy,
        where,
        take,
      }),
    ]);

    return { results, count, errors: null };
  }

  async detail({ guid }: Prisma.SampleWhereUniqueInput): Promise<
    WithError<{
      result: Sample;
    }>
  > {
    const result = await this.prisma.sample.findUniqueOrThrow({
      where: {
        guid,
      },
    });

    return { result, errors: null };
  }
}
