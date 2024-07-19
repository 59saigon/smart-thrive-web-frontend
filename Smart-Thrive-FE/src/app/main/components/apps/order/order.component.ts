import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrderCreateOrUpdateComponent } from './order-create-or-update/order-create-or-update.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderService } from '../../../services/services/order.service';
import { Order } from '../../../../data/entities/order';
import { PaginatedRequest } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class OrderComponent implements OnInit {
  @ViewChild(OrderCreateOrUpdateComponent) orderCreateOrUpdateComponent!: OrderCreateOrUpdateComponent;
  @ViewChild(OrderDetailComponent) orderDetailComponent!: OrderDetailComponent;

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialize();
    this.isShowDetail = false;

    this.orderService.refreshComponent$.subscribe(() => {
      this.initialize();
    });
  }

  initialize(): void {
    this.clear();
    this.getListOrder();
    this.getSelectedColumns();
  }

  clear() {
    this.order = {} as Order;
    this.orders = [];
    this.selectedOrders = [];
  }

  orderDialog: boolean = false;
  deleteOrderDialog: boolean = false;
  deleteOrdersDialog: boolean = false;

  orders: Order[] = [];
  order: Order = {} as Order;
  selectedOrders: Order[] = [];

  submitted: boolean = false;
  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20, 50];
  statuses: any[] = [];
  _selectedColumns: any[] = [];
  activeState: boolean[] = [true, false, false];

  toggle(index: number) {
    this.activeState[index] = !this.activeState[index];
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: -1
  };

  paginatedListResponse: PaginatedListResponse<Order> = {} as PaginatedListResponse<Order>;
  getListOrder(): void {
    this.orderService.getAllPagination(this.paginatedRequest).subscribe({
      next: (response) => {
        this.paginatedListResponse = response;
        this.setPaginatedRequest();
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }
  getSelectedColumns() {
    this.cols = headerList;
    this._selectedColumns = this.cols.filter((col) => !col.isDisabled);
  }

  loadPatientListing(event: any) {
    this.paginatedRequest.pageSize = event.rows;
    this.paginatedRequest.pageNumber = event.first / event.rows + 1;
    this.paginatedRequest.sortField = event.sortField;
    this.paginatedRequest.sortOrder = event.sortOrder;

    this.getListOrder();
  }

  setPaginatedRequest() {
    this.paginatedRequest.pageNumber = this.paginatedListResponse.pageNumber;
    this.paginatedRequest.pageSize = this.paginatedListResponse.pageSize;
    this.paginatedRequest.sortField = this.paginatedListResponse.sortField;
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  deleteSelectedOrders() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected orders?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //call api

        this.selectedOrders.forEach((m) => {
          this.orderService.delete(m.id).subscribe({
            next: (response) => {
              this.ngOnInit();
            },
            error: (err) => {
            },
          });
        });

        this.selectedOrders = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Orders Deleted', life: 3000 });
      }
    });
  }

  deleteOrder(order: Order) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + order.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService.delete(order.id).subscribe({
          next: (response) => {
            this.ngOnInit();
          },
          error: (err) => {
          },
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Deleted', life: 3000 });
      }
    });
  }

  editOrder(order: Order) {
    this.orderCreateOrUpdateComponent.order = order;
    this.orderCreateOrUpdateComponent.ngOnInit();
    this.orderCreateOrUpdateComponent.editOrder(order);
  }

  isShowDetail: boolean = false;
  navigateAfterSelected(order: Order) {
    this.activeState[1] = true;
    this.isShowDetail = true;
    this.orderDetailComponent.order = order;
    this.orderDetailComponent.ngOnInit();
  }

  onGlobalFilter(table: Table, event: Event) { }
}