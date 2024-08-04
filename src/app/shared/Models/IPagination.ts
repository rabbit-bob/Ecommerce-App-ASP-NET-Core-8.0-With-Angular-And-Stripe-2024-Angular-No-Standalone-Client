import { IProduct } from "./IProduct";

export interface IPagination {
    pageNumber: number;
    pageSize: number;
    count: number;
    data: IProduct[];
  }