import { join } from 'path';
import { generateCommonProtoPaths } from '@common/utils/proto-paths';

const paths = [
  'common/common.proto',
  'sample/sample.proto',
  'sample/service.proto',
];

export const protoPath = generateCommonProtoPaths(
  join(__dirname, '..', '..', 'protos'),
  paths,
);
