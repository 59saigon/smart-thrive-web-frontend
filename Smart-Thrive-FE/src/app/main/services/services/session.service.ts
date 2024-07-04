import { Injectable } from '@angular/core';
import { Session } from '../../../data/entities/session';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends BaseService<Session>{

  constructor(public _http: HttpClient) {
    super(_http, 'session')
  }
}
