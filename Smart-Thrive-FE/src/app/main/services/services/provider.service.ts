import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BaseService } from '../base/base.service';
import { Provider } from '../../../data/entities/provider';

@Injectable({
  providedIn: 'root'
})
export class ProviderService extends BaseService<Provider>{

  constructor(public _http: HttpClient) {
    super(_http, 'provider')
  }
}
