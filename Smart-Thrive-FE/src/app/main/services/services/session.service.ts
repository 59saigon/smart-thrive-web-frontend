import { Injectable } from '@angular/core';
import { Session } from '../../../data/entities/session';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends BaseService<Session>{

  private refreshComponent = new Subject<void>();

  refreshComponent$ = this.refreshComponent.asObservable();

  triggerRefresh() {
    this.refreshComponent.next();
  }
  
  constructor(public _http: HttpClient) {
    super(_http, 'session')
  }
}
