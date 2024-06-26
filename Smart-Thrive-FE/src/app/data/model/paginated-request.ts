export interface PaginatedRequest {
    pageNumber: number;
    pageSize: number;
    orderBy: string;
}

export interface PaginatedRequestFillter<TResult> extends PaginatedRequest {
    result?: TResult;
}