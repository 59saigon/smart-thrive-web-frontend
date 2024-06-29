export interface PaginatedRequest {
    pageNumber: number;
    pageSize: number;
    sortField: string;
    sortOrder: number;
}

export interface PaginatedRequestFillter<TResult> extends PaginatedRequest {
    result?: TResult;
}