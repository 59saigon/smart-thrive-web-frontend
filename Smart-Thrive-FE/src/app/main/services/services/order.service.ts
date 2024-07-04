import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Order } from '../../../data/entities/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService<Order>{

  constructor(public _http: HttpClient) {
    super(_http, 'order')
  }
}
