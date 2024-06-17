export interface BaseResponse {
    code: number;
    totalRecords: number;
    isSuccess: boolean;
    message: string;
  }
  
  export interface BaseResponseWithResult<TResult> extends BaseResponse {
    result: TResult;
  }
  
  export interface BaseResponseBool {
    isData: boolean;
    code: number;
    message: string;
  }
  
  export interface BaseResponseList<TResult> extends BaseResponse {
    results: TResult[];
  }
  
  export interface LoginResponse<TResult> extends BaseResponse {
    result: TResult;
    token: string;
    expiration: string;
  }
  