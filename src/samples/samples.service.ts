import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { getListOptions } from '../common/utils/listParams';
import { SampleCreateRequest } from './dto/create-sample.dto';
import { SampleUpdateRequest } from './dto/update-sample.dto';
import { Prisma, Sample } from '@prisma/generated';
import { SampleListRequest } from './dto/list-sample.dto';
import { generateGuid } from '../common/utils/generateGuid';
import { Error } from '@protogen/sample/common';
import { WithError } from '../types/utils';

@Injectable()
export class SamplesService {
  constructor(
    private prisma: PrismaService,
    @Inject('sample-service') private client: ClientRMQ,
  ) {}

  async create(
    sample: SampleCreateRequest,
  ): Promise<WithError<{ result: Sample; errors: Error[] }>> {
    const sampleToCreate: Prisma.SampleCreateInput = {
      guid: generateGuid(),
      title: sample.title,
      text: sample.text,
    };

    const result = await this.prisma.sample.create({
      data: sampleToCreate,
    });

    // RabbitMQ event is sent here
    this.client.emit('sample.pattern', {
      message: 'Sample message',
      restData: 'Rest sample data',
    });

    return { result, errors: [] };
  }

  async update(
    guid: string,
    sample: SampleUpdateRequest,
  ): Promise<WithError<{ result: Sample; errors: Error[] }>> {
    const result = await this.prisma.sample.update({
      data: sample,
      where: {
        guid,
      },
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
      errors: Error[];
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
