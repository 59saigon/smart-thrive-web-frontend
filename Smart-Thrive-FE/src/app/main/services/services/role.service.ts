import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Observable, Subject } from 'rxjs';
import { Role } from '../../../data/entities/role';
import { ItemResponse } from '../../../data/model/base-response';
import { ConstantsApi } from '../../../shared/constants/constants-api';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService<Role>{

  private refreshComponent = new Subject<void>();

  refreshComponent$ = this.refreshComponent.asObservable();

  triggerRefresh() {
    this.refreshComponent.next();
  }
  
  constructor(public _http: HttpClient) {
    super(_http, 'role')
  }

  getByRoleName(roleName: string): Observable<ItemResponse<Role>> {
    return this.http.get<ItemResponse<Role>>(`${this.getBaseUrl()}/get-by-role-name?roleName=${roleName}`, {
      headers: this.getHeaders()
    });
  }
}
