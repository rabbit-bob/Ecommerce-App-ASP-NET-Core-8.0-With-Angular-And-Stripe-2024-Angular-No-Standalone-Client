import { IProduct } from './product';

export interface IPagination {
  pageNumber: number;
  pageSize: number;
  count: number;
  data: IProduct[];
}
