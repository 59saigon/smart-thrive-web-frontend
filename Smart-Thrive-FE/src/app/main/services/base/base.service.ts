import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Guid } from "guid-typescript";
import { Observable } from "rxjs";
import { BaseResponse, ItemListResponse, ItemResponse } from "../../../data/model/base-response";
import { PaginatedRequest, PaginatedRequestFillter } from "../../../data/model/paginated-request";
import { PaginatedListResponse } from "../../../data/model/paginated-response";
import { ConstantsApi } from "../../../shared/constants/constants-api";
import { BaseEntity } from "../../../data/entities/baseEntity";

@Injectable({
  providedIn: 'root',
})
export class BaseService<TEntity extends BaseEntity> {
  entityTxt!: String;
  constructor(public http: HttpClient, public _entityTxt: String) {
    this.entityTxt = _entityTxt;
  }
  private getHeaders(): { [header: string]: string | string[] } {
    return {
      'ngrok-skip-browser-warning': 'true'
    };
  }
  public getBaseUrl(): string {
    return `${ConstantsApi.baseApi}/${this.entityTxt}`;
  }

  add(entity: TEntity): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${this.getBaseUrl()}${ConstantsApi.add}`, entity, {
      headers: this.getHeaders()
    });
  }
  
  update(entity: TEntity): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(`${this.getBaseUrl()}${ConstantsApi.update}`, entity, {
      headers: this.getHeaders()
    });
  }
  
  delete(id: Guid): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(`${this.getBaseUrl()}${ConstantsApi.delete}/?id=${id}`, null, {
      headers: this.getHeaders()
    });
  }
  
  getAllPagination(request: PaginatedRequest): Observable<PaginatedListResponse<TEntity>> {
    return this.http.post<PaginatedListResponse<TEntity>>(`${this.getBaseUrl()}${ConstantsApi.getAllPagination}`, request, {
      headers: this.getHeaders()
    });
  }
  
  getAll(): Observable<ItemListResponse<TEntity>> {
    return this.http.get<ItemListResponse<TEntity>>(`${this.getBaseUrl()}${ConstantsApi.getAll}`, {
      headers: this.getHeaders()
    });
  }
  
  getAllSearch(request: PaginatedRequestFillter<TEntity>): Observable<PaginatedListResponse<TEntity>> {
    return this.http.post<PaginatedListResponse<TEntity>>(`${this.getBaseUrl()}${ConstantsApi.getAllSearch}`, request, {
      headers: this.getHeaders()
    });
  }
  
  getById(id: Guid): Observable<ItemResponse<TEntity>> {
    return this.http.get<ItemResponse<TEntity>>(`${this.getBaseUrl()}${ConstantsApi.getById}/${id}`, {
      headers: this.getHeaders()
    });
  }
  
}
