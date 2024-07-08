import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../../data/entities/category';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService<Category> {

  private refreshComponent = new Subject<void>();

  refreshComponent$ = this.refreshComponent.asObservable();

  triggerRefresh() {
    this.refreshComponent.next();
  }

  constructor(public _http: HttpClient) {
    super(_http, 'category')
  }

}
