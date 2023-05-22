import { join } from 'path';

export const generateCommonProtoPaths = (
  folderPath: string,
  protoPaths: string[],
) => {
  return protoPaths.map((protoPath) => {
    return join(folderPath, protoPath);
  });
};
