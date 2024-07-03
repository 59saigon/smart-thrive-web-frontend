import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from '../../../layout/services/app.layout/app.layout.service';
import { Order } from '../../../data/entities/order';
import { OrderService } from '../../services/services/order.service';
import { ItemListResponse } from '../../../data/model/base-response';
import { UserService } from '../../services/services/user.service';
import { User } from '../../../data/entities/user';
import { StudentService } from '../../services/services/student.service';
import { Student } from '../../../data/entities/student';
import { ChartOptions } from 'chart.js';

@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  items!: MenuItem[];

  orders: Order[] = [];

  users: User[] = [];

  students: Student[] = [];

  itemListResponse: ItemListResponse<Order> = {} as ItemListResponse<Order>;

  chartData: any;

  chartOptions: ChartOptions | undefined;

  subscription!: Subscription;

  constructor(private orderService: OrderService
    , private userService: UserService
    , private studentService: StudentService
    , public layoutService: LayoutService) {
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe((config) => {
        this.initChart();
      });
  }

  ngOnInit() {
    this.initChart();
    this.getListOrder();
    this.getListUser();
    this.getListStudent();

    this.items = [
      { label: 'Add New', icon: 'pi pi-fw pi-plus' },
      { label: 'Remove', icon: 'pi pi-fw pi-minus' }
    ];
  }

  getListOrder() {
    this.orderService.getAll().subscribe({
      next: (response) => {
        this.itemListResponse = response;
        this.orders = this.itemListResponse.results;
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }

  getListUser() {
    this.userService.getAll().subscribe({
      next: (response) => {
        this.users = response.results;
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }

  getListStudent() {
    this.studentService.getAll().subscribe({
      next: (response) => {
        this.students = response.results;
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }

  revenueFromOrders(): number {
    var totalRevenue = 0;
    this.orders.forEach(item => {
      totalRevenue += item.totalPrice ? item.totalPrice : 0;
    });

    return totalRevenue;
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
          borderColor: documentStyle.getPropertyValue('--bluegray-700'),
          tension: .4
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--green-600'),
          borderColor: documentStyle.getPropertyValue('--green-600'),
          tension: .4
        }
      ]
    };

    this.chartOptions = {

      plugins: {
        legend: {
          labels: {
            color: textColor,
          }
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            //draw: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            //drawBorder: false
          }
        }
      }
    };
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}