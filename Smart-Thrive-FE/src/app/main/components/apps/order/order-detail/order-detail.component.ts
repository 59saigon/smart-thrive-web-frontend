import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Order } from '../../../../../data/entities/order';
import { PaginatedRequest } from '../../../../../data/model/paginated-request';
import { Category } from '../../../../../data/entities/category';
import { Course } from '../../../../../data/entities/course';
import { Package } from '../../../../../data/entities/package';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  constructor(private messageService: MessageService) { }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  id: string | null = null;
  order: Order = {} as Order;
  package: Package = {} as Package;

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: 1
  };
  ngOnInit(): void {
    this.package = this.order.package ?? {} as Package;
  }
}
