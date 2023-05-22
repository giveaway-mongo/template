import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { getListOptions } from '../common/utils/list-params';
import { SampleCreateRequest } from './dto/create-sample.dto';
import { SampleUpdateRequest } from './dto/update-sample.dto';
import { Prisma, Sample } from '@prisma/generated';
import { SampleListRequest } from './dto/list-sample.dto';
import { generateGuid } from '../common/utils/generate-guid';
import { WithError } from '../common/types/utils';
import { SampleEvent } from './dto/broker.dto';

@Injectable()
export class SamplesService {
  constructor(
    private prisma: PrismaService,
    @Inject('sample-service') private client: ClientRMQ,
  ) {}

  async create(
    sample: SampleCreateRequest,
  ): Promise<WithError<{ result: Sample }>> {
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

    return { result, errors: [] };
  }

  async update(
    guid: string,
    sample: SampleUpdateRequest,
  ): Promise<WithError<{ result: Sample }>> {
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

    return { result, errors: [] };
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

    return { results, count, errors: [] };
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

    return { result, errors: [] };
  }
}
