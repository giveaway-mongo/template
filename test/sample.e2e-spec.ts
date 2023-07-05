import { INestApplication } from '@nestjs/common';
import { SamplesController } from '../src/modules/samples/samples.controller';
import prisma from './client';
import { samples } from './fixtures/samples';
import { applyFixtures } from './utils/applyFixtures';
import {
  SampleCreateRequest,
  SampleUpdateRequest,
} from '@protogen/sample/sample';

describe('SampleController (e2e)', () => {
  let app: INestApplication;
  let controller: SamplesController;

  beforeEach(async () => {
    app = (global as any).app;
    controller = app.get<SamplesController>(SamplesController);

    await applyFixtures(samples, prisma.sample);
  });

  it('gets list of samples', async () => {
    const response = await controller.list({ options: undefined });

    expect(response.count).toEqual(3);

    const results = response.results;
    const count = response.count;

    expect(count).toEqual(3);

    expect(results[0].guid).toEqual('66e33c1b-938a-497b-89db-56532322ac49');
    expect(results[0].title).toEqual('First sample title');
    expect(results[0].text).toEqual('This is the first test sample!');

    expect(results[1].guid).toEqual('9c3feb28-1438-456e-be4f-d6edabebb3d2');
    expect(results[1].title).toEqual('Second sample title');
    expect(results[1].text).toEqual('This is the second test sample!');

    expect(results[2].guid).toEqual('039b06f5-e1e8-48f4-8de9-4f88da9e07df');
    expect(results[2].title).toEqual('Third sample title');
    expect(results[2].text).toEqual('This is the third test sample!');
  });

  it('gets one sample', async () => {
    const response = await controller.detail({
      guid: '9c3feb28-1438-456e-be4f-d6edabebb3d2',
    });

    const result = response.result;

    expect(result.guid).toEqual('9c3feb28-1438-456e-be4f-d6edabebb3d2');
    expect(result.title).toEqual('Second sample title');
    expect(result.text).toEqual('This is the second test sample!');
  });

  it('creates one sample', async () => {
    const sample: SampleCreateRequest = {
      userGuid: '039b06f5-e1e8-48f4-8de9-4f88da9e07d2',
      title: 'Title for created sample',
      text: 'Text for created sample',
    };

    const response = await controller.create(sample);

    expect(response.result.guid).toBeDefined();
    expect(response.result.title).toEqual(sample.title);
    expect(response.result.text).toEqual(sample.text);
  });

  it('updates one sample', async () => {
    const updatedSample: SampleUpdateRequest = {
      userGuid: '039b06f5-e1e8-48f4-8de9-4f88da9e07d2',
      guid: '039b06f5-e1e8-48f4-8de9-4f88da9e07df',
      title: 'Updated title',
      text: 'Updated text',
    };

    const response = await controller.update(updatedSample);

    const result = response.result;

    expect(result.guid).toEqual(updatedSample.guid);
    expect(result.title).toEqual(updatedSample.title);
    expect(result.text).toEqual(updatedSample.text);

    const detailResponse = await controller.detail({
      guid: updatedSample.guid,
    });

    const detailResult = detailResponse.result;

    expect(detailResult.guid).toEqual(updatedSample.guid);
    expect(detailResult.title).toEqual(updatedSample.title);
    expect(detailResult.text).toEqual(updatedSample.text);
  });

  it('errors. Creating one sample without title', async () => {
    const sample: SampleCreateRequest = {
      userGuid: '039b06f5-e1e8-48f4-8de9-4f88da9e07d2',
      title: null,
      text: 'Text for created sample',
    };
    try {
      await controller.create(sample);
    } catch (error) {
      expect(error.error.fieldErrors[0].location[0]).toEqual('title');
    }
  });

  it('errors. Creating one sample without text', async () => {
    const sample: SampleCreateRequest = {
      userGuid: '039b06f5-e1e8-48f4-8de9-4f88da9e07d2',
      title: 'title',
      text: null,
    };

    try {
      await controller.create(sample);
    } catch (error) {
      expect(error.error.fieldErrors[0].location[0]).toEqual('text');
    }
  });

  it('errors. Creating one sample without title and text', async () => {
    const sample: SampleCreateRequest = {
      userGuid: '039b06f5-e1e8-48f4-8de9-4f88da9e07d2',
      title: null,
      text: null,
    };

    try {
      await controller.create(sample);
    } catch (error) {
      expect(error.error.fieldErrors[0].location[0]).toEqual('title');
      expect(error.error.fieldErrors[1].location[0]).toEqual('text');
    }
  });
});
