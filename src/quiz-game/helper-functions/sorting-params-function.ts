export function parseSortParams(sortParam) {
  const sortParams = {};

  if (typeof sortParam === 'string') {
    const [sortBy, sortDirection] = sortParam.split(' ');
    const formattedSortBy = `${sortBy.charAt(0).toUpperCase()}${sortBy.slice(1)}`;
    sortParams[`sortBy${formattedSortBy}`] = sortBy;
    sortParams[`sortDirection${formattedSortBy}`] = sortDirection || 'asc';
  } else if (Array.isArray(sortParam)) {
    sortParam.forEach((sort, index) => {
      const [sortBy, sortDirection] = sort.split(' ');
      const formattedSortBy = `${sortBy.charAt(0).toUpperCase()}${sortBy.slice(1)}`;
      sortParams[`sortBy${formattedSortBy}`] = sortBy;
      sortParams[`sortDirection${formattedSortBy}`] = sortDirection || 'asc';
    });
  }

  return sortParams;
}
