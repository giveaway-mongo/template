import { Error } from '@protogen/common/common';

export type WithError<T> = T & { errors: Error };
