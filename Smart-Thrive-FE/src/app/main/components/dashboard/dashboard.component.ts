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
import { CourseService } from '../../services/services/course.service';
import { Course } from '../../../data/entities/course';
import { PaginatedRequest } from '../../../data/model/paginated-request';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
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
    sortField: 'LastUpdatedDate',
    sortOrder: -1
  };


  paginatedOrderRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 10,
    sortField: 'CreatedDate',
    sortOrder: -1
  };

  itemListResponse: ItemListResponse<Order> = {} as ItemListResponse<Order>;

  chartOrder: any;
  chartCourse: any;
  chartOrderOptions: ChartOptions | undefined;
  chartCourseOptions: ChartOptions | undefined;
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

    if (this.orders != null) {
      this.orders.forEach((order) => {
        const orderDate = new Date(order.createdDate);
        if (orderDate.getFullYear() === currentYear) {
          const month = orderDate.getMonth(); // 0 = January, 1 = February, ...
          monthlySums[month] += order.totalPrice ? order.totalPrice : 0;
          monthlyCounts[month]++;
        }
      });
    }

    return monthlySums;
  }

  averageQuantityMonthlyOrders(): number[] {
    const currentYear = new Date().getFullYear();
    const monthlySums = Array(12).fill(0);
    const monthlyCounts = Array(12).fill(0);
    console.log("check_orders", this.orders);
    if (this.orders != null) {
      this.orders.forEach((order) => {
        const orderDate = new Date(order.createdDate);
        if (orderDate.getFullYear() === currentYear) {
          const month = orderDate.getMonth(); // 0 = January, 1 = February, ...
          monthlySums[month] += order.id != null ? 1 : 0;
          monthlyCounts[month]++;
        }
      });
    }

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
    const averageQuantityOrders = this.averageQuantityMonthlyOrders();

    console.log("check_quantity",averageQuantityOrders);

    this.chartOrder = {
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
        {
          label: 'Average Quantity Orders',
          data: averageQuantityOrders,
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--green-600'),
          borderColor: documentStyle.getPropertyValue('--green-600'),
          tension: .4
        }
      ]
    };

    this.chartOrderOptions = {
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

    this.getListCourse();
    const summarySlots = this.calculateTotalSlots();
    this.chartCourse = {
      labels: this.courses.map(course => course.courseName || 'Unknown Course'),
      datasets: [
        // {
        //   label: 'Tỉ lệ slot đăng ký (%)',
        //   data: this.courses.map(course => (this.calculatePercentage(course.totalSlots? course.totalSlots : 0, summarySlots))),
        //   backgroundColor: [
        //     "#36BA98",
        //     "#3FA2F6",
        //     "#FFF078",
        //     "#973131",
        //     "#F19ED2",
        //     "#FF6969",
        //     "#06D001",
        //     "#102C57",
        //     "#FFB1B1",
        //     "#686D76",
        //   ],
          
        // },
        {
          label: 'Total slots',
          data: this.courses.map(course => course.totalSlots ),
          backgroundColor: [
            "#36BA98",
            "#3FA2F6",
            "#FFF078",
            "#973131",
            "#F19ED2",
            "#FF6969",
            "#06D001",
            "#102C57",
            "#FFB1B1",
            "#686D76",
          ],
          
        },

      ]
    };

    this.chartOrderOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          }
        },
      },

    };
  }

  calculateTotalSlots(): number {
    return this.courses.reduce((sum, course) => sum + (course.totalSlots ?? 0), 0);
  }
  
  calculatePercentage(value: number, total: number): number {
    if (total === 0) {
      return 0;
    }
    return (value / total) * 100;
  }
  
  

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}