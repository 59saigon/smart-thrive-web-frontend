import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderComponent } from '../order.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Order } from '../../../../../data/entities/order';
import { OrderService } from '../../../../services/services/order.service';
import { Category } from '../../../../../data/entities/category';

@Component({
  selector: 'app-order-create-or-update',
  templateUrl: './order-create-or-update.component.html',
  styleUrl: './order-create-or-update.component.scss'
})
export class OrderCreateOrUpdateComponent implements OnInit {

  order: Order = {} as Order;
  learnDate!: Date;

  orderDialog: boolean = false;
  submitted: boolean = false;



  constructor(private orderService: OrderService, private messageService: MessageService, private confirm: ConfirmationService) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();
  }

  setTitleAndInformation() {
    if (this.order.id == null) {
      this.title = "New order";
      this.information = "Create new information order."
    } else {
      this.title = "Details order";
      this.information = "Update new information order."
    }

  }

  openNew() {
    this.order = {} as Order;
    this.orderDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.orderDialog = false;
    this.submitted = false;
  }

  editOrder(order: Order) {
    this.order = { ...order };
    this.orderDialog = true;
    this.submitted = false;
  }

  saveOrder() {
    this.submitted = true;

    if (this.order.id != null) {
      this.orderService.update(this.order).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.orderService.triggerRefresh();
          
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    } else {
      this.orderService.add(this.order).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.orderService.triggerRefresh();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    }

    this.orderDialog = false;
  }
}


