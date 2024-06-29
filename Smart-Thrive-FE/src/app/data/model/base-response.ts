export interface BaseResponse {
  isSuccess: boolean;
  message: string;
}

export interface LoginResponse<TResult> extends BaseResponse {
  result: TResult;
  token: string;
  expiration: string;
}

export interface ItemResponse<TResult> extends BaseResponse {
  result?: TResult;
}

export interface ItemListResponse<TResult> extends BaseResponse {
  result?: TResult[];
  totalRecords: number;
}
