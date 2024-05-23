export class SortingQueryParamsForQuizGame {
  sortBy: string;
  sortDirection: string;
  pageNumber: number;
  pageSize: number;
}

export class SortingQueryParamsForTopScoreUsers {
  sort: string | string[];
  pageNumber: number;
  pageSize: number;
}
