import { Controller } from '@nestjs/common';
import { SamplesService } from './samples.service';
import { Ctx, EventPattern, GrpcMethod, Payload, RmqContext, Transport } from '@nestjs/microservices'

import {
  SampleCreateRequest,
  SampleCreateResponse,
} from './dto/create-sample.dto';

import {
  SampleUpdateRequest,
  SampleUpdateResponse,
} from './dto/update-sample.dto';

import {
  SampleDetailRequest,
  SampleDetailResponse,
} from './dto/detail-sample.dto';

import { SampleListRequest, SampleListResponse } from './dto/list-sample.dto';

@Controller()
export class SamplesController {
  constructor(private readonly samplesService: SamplesService) {}

  @GrpcMethod('SamplesService', 'CreateSample')
  async create(
    sampleCreateRequest: SampleCreateRequest,
  ): Promise<SampleCreateResponse> {
    const { result, errors } = await this.samplesService.create(
      sampleCreateRequest,
    );

    return { result, errors };
  }

  @GrpcMethod('SamplesService', 'UpdateSample')
  async update(
    sampleUpdateRequest: SampleUpdateRequest,
  ): Promise<SampleUpdateResponse> {
    const guid = sampleUpdateRequest.guid;

    const { result, errors } = await this.samplesService.update(
      guid,
      sampleUpdateRequest,
    );

    return { result, errors };
  }

  @GrpcMethod('SamplesService', 'ListSample')
  async list(listRequest: SampleListRequest): Promise<SampleListResponse> {
    const { results, count, errors } = await this.samplesService.list(
      listRequest,
    );

    return { results, count, errors };
  }

  @GrpcMethod('SamplesService', 'DetailSample')
  async detail({ guid }: SampleDetailRequest): Promise<SampleDetailResponse> {
    const { result, errors } = await this.samplesService.detail({ guid });

    return { result, errors };
  }

  @EventPattern('sample.pattern', Transport.RMQ)
  async sampleConsumer(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('received');
    console.log(
      data,
      context.getPattern(),
      context.getPattern(),
      context.getMessage(),
    );
  }
}
