import { AfterViewInit, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';
import { Menu } from 'primeng/menu';
import { LayoutService } from '../../services/app.layout/app.layout.service';
import { UserService } from '../../../main/services/services/user.service';
import { CourseService } from '../../../main/services/services/course.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrl: './app.menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppMenuComponent implements OnInit, AfterViewInit {
  model: any[] = [];
  otherModel: any[] = [];

  menuVisible: boolean = false;
  avatarWidth: number = 0;

  @ViewChild('avatar') _avatar!: ElementRef;
  @ViewChild('menu') _menu!: Menu;

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  isMenuOpen = this.layoutService.isDesktop();

  private hideMenuTimeout: any;

  constructor(
    public layoutService: LayoutService,
    public userService: UserService,
    public courseService: CourseService
  ) { }
  ngAfterViewInit(): void {
    if (this._avatar) {
      this.avatarWidth = this._avatar.nativeElement.offsetWidth;
    } else {
      console.log('check_avatar', 'Avatar element not found!');
    }
    this.resetHideMenuTimeout();
  }

  setAvatarUrl(): string {
    const user = this.userService.getUserDetails();
    if (user && user.picture) {
      const base64Prefix = `data:image/png;base64,${user.picture}`;
      console.log("imgbase64", base64Prefix);
      if (base64Prefix.includes('image')) {
        return base64Prefix;
      } else {
        return 'path/to/default/image.png';
      }
    }
    return 'path/to/default/image.png';
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.layoutService.onMenuToggle();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.hideMenuImmediately();
  }
  private resetHideMenuTimeout(): void {
    // Clear any existing timeout
    if (this.hideMenuTimeout) {
      clearTimeout(this.hideMenuTimeout);
    }

    // Show the menu
    const menuElement = document.querySelector('.p-menu.p-menu-overlay') as HTMLElement;
    if (menuElement) {
      menuElement.classList.remove('hidden');
    }
  }

  private hideMenuImmediately(): void {
    // Hide the menu immediately
    const menuElement = document.querySelector('.p-menu.p-menu-overlay') as HTMLElement;
    if (menuElement) {
      menuElement.classList.add('hidden');
    }
  }

  ngOnInit() {
    console.log("init", "sidebar");
    this.initialize();

    this.courseService.refreshComponent$.subscribe(() => {
      this.initialize();
    });
  }

  initialize(): void {
    this.getListCourse()
      .then(() => {
        this.resetHideMenuTimeout();
        this.setModel();
        this.setSettingModel();
      })
  }

  showAndHideMenu($ev: Event) {
    this._menu.toggle($ev);
    this.resetHideMenuTimeout();
  }
  openMenu() {
    this.resetHideMenuTimeout();
  }
  onOpenConfigModule() {
    this.layoutService.showConfigSidebar();
  }
  setSettingModel() {
    this.otherModel = [
      {
        label: 'Settings',
        icon: 'pi pi-fw pi-cog',
        command: () => {
          this.onOpenConfigModule();
        },
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
        command: () => {
          this.userService.logout();
          window.location.reload();
        },
      },
    ];
  }

  quantityCoursePending: number = 0;

  getListCourse(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.courseService.getAllPendingStatus().subscribe({
        next: (response) => {
          var courses = response.results;
          this.quantityCoursePending = courses.length ? courses.length : 0;
          console.log("check_course",courses);
          console.log("check_quantity",this.quantityCoursePending);
          resolve(); // Resolve the promise when the operation is done
        },
        error: (err) => {
          console.log("check_error", err);
          reject(err); // Reject the promise if there's an error
        },
      });
    });
  }


  setModel() {
    const isStaff = this.userService.getRole() === "Staff";
    const isAdmin = this.userService.getRole() === "Admin";
    const isProvider = this.userService.getRole() === "Provider";
    this.model = [
      !isProvider &&{
        label: 'General',
        items: [
          !isStaff &&{
            label: 'Dashboard',
            icon: 'pi pi-chart-line',
            routerLink: ['/dashboard'],
          },
          (isStaff || isAdmin) && {
            label: 'Approvals',
            icon: 'pi pi-inbox',
            badge: this.quantityCoursePending,
            routerLink: ['/approvals'],
          },
        ],
      },
      {
        label: 'App Management',
        items: [
          !isProvider && {
            label: 'Package',
            icon: 'pi pi-box',
            routerLink: ['/apps/package'],
          },
          {
            label: 'Course',
            icon: 'pi pi-objects-column',
            routerLink: ['/apps/course'],
          },
          !isProvider && {
            label: 'Session',
            icon: 'pi pi-bookmark',
            routerLink: ['/apps/session'],
          },
          !isProvider && {
            label: 'Order',
            icon: 'pi pi-shopping-cart',
            routerLink: ['/apps/order'],
          },
          !isProvider && {
            label: 'Subject',
            icon: 'pi pi-book',
            routerLink: ['/apps/subject'],
          },
          !isStaff && !isProvider && {
            label: 'User',
            icon: 'pi pi-user',
            routerLink: ['/apps/user'],
            items: [
              {
                label: 'Provider',
                icon: 'pi pi-user',
                routerLink: ['/apps/user/provider'],
              },
              {
                label: 'Student',
                icon: 'pi pi-user',
                routerLink: ['/apps/user/student'],
              },
            ],
          },

        ].filter(Boolean), // Filters out falsy values (like 'false' when isStaff is true)
      },
      // Additional menu items can be uncommented and added here as needed
      // {
      //     label: 'Application',
      //     items: [
      //         {
      //             label: 'Schedule',
      //             icon: 'pi pi-calendar',
      //             routerLink: ['/management/schedule'],
      //         },
      //         {
      //             label: 'Feedback',
      //             icon: 'pi pi-comments',
      //             routerLink: ['/management/feedback'],
      //         },
      //         {
      //             label: 'Comment',
      //             icon: 'pi pi-comment',
      //             routerLink: ['/management/comment'],
      //         },
      //         {
      //             label: 'Blog',
      //             icon: 'pi pi-pencil',
      //             routerLink: ['/management/blog'],
      //         },
      //         {
      //             label: 'Voucher',
      //             icon: 'pi pi-tag',
      //             routerLink: ['/management/voucher'],
      //         },
      //         {
      //             label: 'Cart',
      //             icon: 'pi pi-shopping-cart',
      //             routerLink: ['/management/cart'],
      //         },
      //         {
      //             label: 'Order',
      //             icon: 'pi pi-shopping-bag',
      //             routerLink: ['/management/order'],
      //         },
      //         {
      //             label: 'OrderDetail',
      //             icon: 'pi pi-info',
      //             routerLink: ['/management/order-detail'],
      //         },
      //     ],
      // },
      // {
      //     label: 'Support',
      //     items: [
      //         {
      //             label: 'Documentation',
      //             icon: 'pi pi-fw pi-question',
      //             routerLink: ['/documentation'],
      //         },
      //         {
      //             label: 'View Source',
      //             icon: 'pi pi-fw pi-search',
      //             url: ['https://github.com/59saigon/smart-thrive-web-frontend'],
      //             target: '_blank',
      //         },
      //     ],
      // },
    ].filter(Boolean); // Filters out falsy values (like 'false' when isStaff is true)
  }

}
