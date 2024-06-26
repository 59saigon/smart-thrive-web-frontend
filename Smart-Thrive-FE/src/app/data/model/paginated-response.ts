import { BaseResponse } from "./base-response";


export interface PaginatedListResponse<TResult> extends BaseResponse {
  results: TResult[];
  totalPages: number;
  totalRecordsPerPage: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  orderBy: string;
}