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
import { CourseService } from '../../services/services/course.service';
import { Course } from '../../../data/entities/course';
import { PaginatedRequest } from '../../../data/model/paginated-request';

@Component({
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

  items!: MenuItem[];
  orders: Order[] = [];
  users: User[] = [];
  students: Student[] = [];
  courses: Course[] = [];

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortField: 'sold_product',
    sortOrder: -1
  };


  paginatedOrderRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortField: 'CreatedDate',
    sortOrder: -1
  };

  itemListResponse: ItemListResponse<Order> = {} as ItemListResponse<Order>;

  chartData: any;
  chartOptions: ChartOptions | undefined;
  subscription!: Subscription;

  constructor(private orderService: OrderService
    , private userService: UserService
    , private studentService: StudentService
    , private courseService: CourseService
    , public layoutService: LayoutService) {
    this.subscription = this.layoutService.configUpdate$
      .pipe()
      .subscribe((config) => {
        this.initChart();
      });
  }

  ngOnInit() {
    this.initChart();
    this.getListOrder();
    this.getListUser();
    this.getListStudent();
    this.getListCourse();
    

    this.items = [
      { label: 'Add New', icon: 'pi pi-fw pi-plus' },
      { label: 'Remove', icon: 'pi pi-fw pi-minus' }
    ];
  }

  getListOrder() {
    this.orderService.getAllPagination(this.paginatedOrderRequest).subscribe({
      next: (response) => {
        this.itemListResponse = response;
        this.orders = this.itemListResponse.results;
        this.initChart();
        console.log("check_order",this.orders)
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }

  averagePriceMonthlyOrders(): number[] {
    const currentYear = new Date().getFullYear();
    const monthlySums = Array(12).fill(0);
    const monthlyCounts = Array(12).fill(0);

    this.orders.forEach((order) => {
      const orderDate = new Date(order.createdDate);
      if (orderDate.getFullYear() === currentYear) {
        const month = orderDate.getMonth(); // 0 = January, 1 = February, ...
        monthlySums[month] += order.totalPrice ? order.totalPrice : 0;
        monthlyCounts[month]++;
      }
    });

    return monthlySums;
  }
  
  averageQuantityMonthlyOrders(): number[] {
    const currentYear = new Date().getFullYear();
    const monthlySums = Array(12).fill(0);
    const monthlyCounts = Array(12).fill(0);

    this.orders.forEach((order) => {
      const orderDate = new Date(order.createdDate);
      if (orderDate.getFullYear() === currentYear) {
        const month = orderDate.getMonth(); // 0 = January, 1 = February, ...
        monthlySums[month] += order ? 1 : 0;
        monthlyCounts[month]++;
      }
    });

    return monthlySums;
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
  
  getListCourse() {
    this.courseService.getAllPagination(this.paginatedRequest).subscribe({
      next: (response) => {
        this.courses = response.results;
        console.log(this.courses);
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

    const averagePriceOrders = this.averagePriceMonthlyOrders();
    console.log('check_priceavg',averagePriceOrders);
    const averageQuantityOrders = this.averageQuantityMonthlyOrders();

    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Average Price Orders',
          data: averagePriceOrders,
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--teal-600'),
          borderColor: documentStyle.getPropertyValue('--teal-600'),
          tension: .4
        },
        // {
        //   label: 'Average Quantity Orders',
        //   data: averageQuantityOrders,
        //   fill: false,
        //   backgroundColor: documentStyle.getPropertyValue('--green-600'),
        //   borderColor: documentStyle.getPropertyValue('--green-600'),
        //   tension: .4
        // }
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
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
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