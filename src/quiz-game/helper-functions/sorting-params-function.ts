import { OrderByCondition } from 'typeorm';

// export function parseSortParams(
//   sortParam: string | string[],
// ): OrderByCondition {
//   const sortParams: OrderByCondition = {};

//   if (typeof sortParam === 'string') {
//     const [sortBy, sortDirection] = sortParam.split(' ');
//     sortParams[sortBy] = sortDirection.toUpperCase() as 'ASC' | 'DESC';
//   } else if (Array.isArray(sortParam)) {
//     sortParam.forEach((sort) => {
//       const [sortBy, sortDirection] = sort.split(' ');
//       sortParams[sortBy] = sortDirection.toUpperCase() as 'ASC' | 'DESC';
//     });
//   }

//   return sortParams;
// }

// import { OrderByCondition } from 'typeorm';

export function parseSortParams(
  sortParam: string | string[],
): OrderByCondition {
  const sortParams: OrderByCondition = {};

  if (typeof sortParam === 'string') {
    const [sortBy, sortDirection] = sortParam.split(' ');
    sortParams[`stats.${sortBy}`] = sortDirection.toUpperCase().trimEnd() as
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
