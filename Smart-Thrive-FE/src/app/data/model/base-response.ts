export interface BaseResponse {
  isSuccess: boolean;
  message: string;
}

export interface LoginResponse<TResult> extends BaseResponse {
  result: TResult;
  token: string;
  expiration: string;
}

export interface SingleResponse<TResult> extends BaseResponse {
  result?: TResult;
}
