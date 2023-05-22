import { ListOptions } from '@protogen/common/common';

const DEFAULT_PAGE_SIZE = 10;

export class ListParams<Where, OrderBy> {
  skip?: number;
  take?: number;
  where?: Where;
  orderBy?: OrderBy[];
}

const getOrdering = <OrderBy>(ordering: string[] = []): OrderBy[] => {
  return ordering.map((order) => {
    if (order.startsWith('+')) {
      const [, sortKey] = order.split('+');

      return { [sortKey]: 'asc' };
    }

    const [, sortKey] = order.split('-');

    return { [sortKey]: 'desc' };
  }) as OrderBy[];
};

const getSkip = (page = 1, limit = DEFAULT_PAGE_SIZE) => {
  return (page - 1) * limit;
};

export const getListOptions = <Where, OrderBy>(
  options?: ListOptions,
): ListParams<Where, OrderBy> => {
  if (options) {
    return {
      skip: getSkip(options.page, options.limit),
      orderBy: getOrdering(options.ordering),
      where: options.filter as Where,
      take: options.limit || DEFAULT_PAGE_SIZE,
    };
  }
  return {
    skip: 0,
    orderBy: undefined,
    where: undefined,
    take: DEFAULT_PAGE_SIZE,
  };
};
