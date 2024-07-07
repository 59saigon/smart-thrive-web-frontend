import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Order } from '../../../data/entities/order';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService<Order>{

  private refreshComponent = new Subject<void>();

  refreshComponent$ = this.refreshComponent.asObservable();

  triggerRefresh() {
    this.refreshComponent.next();
  }

  constructor(public _http: HttpClient) {
    super(_http, 'order')
  }
}
