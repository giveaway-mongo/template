import { Prisma } from '@prisma/generated';

export const samples: Prisma.SampleCreateInput[] = [
  {
    guid: '66e33c1b-938a-497b-89db-56532322ac49',
    title: 'First sample title',
    text: 'This is the first test sample!',
  },
  {
    guid: '9c3feb28-1438-456e-be4f-d6edabebb3d2',
    title: 'Second sample title',
    text: 'This is the second test sample!',
  },
  {
    guid: '039b06f5-e1e8-48f4-8de9-4f88da9e07df',
    title: 'Third sample title',
    text: 'This is the third test sample!',
  },
];
