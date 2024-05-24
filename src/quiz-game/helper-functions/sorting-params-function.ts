export interface SortParams {
  [key: string]: 'ASC' | 'DESC';
}

export function parseSortParams(sortParam: string | string[]): SortParams {
  const sortParams: SortParams = {};

  if (typeof sortParam === 'string') {
    const [sortBy, sortDirection] = sortParam.split(' ');
    sortParams[`stats.${sortBy}`] = sortDirection.toUpperCase() as
      | 'ASC'
      | 'DESC';
  } else if (Array.isArray(sortParam)) {
    sortParam.forEach((sort) => {
      const [sortBy, sortDirection] = sort.split(' ');
      sortParams[`stats.${sortBy}`] = sortDirection.toUpperCase() as
        | 'ASC'
        | 'DESC';
    });
  }

  return sortParams;
}
