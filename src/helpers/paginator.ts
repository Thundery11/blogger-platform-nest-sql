export class Paginator<T> {
  public pagesCount: number;
  public page: number;
  public pageSize: number;
  public totalCount: number;
  public items: T;

  static paginate<T>(data: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    pagesCount: number;
    items: T;
  }): Paginator<T> {
    return {
      pagesCount: data.pagesCount,
      page: data.pageNumber,
      pageSize: data.pageSize,
      totalCount: data.totalCount,
      items: data.items,
    };
  }
}
