import { AfterViewInit, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { Menu } from 'primeng/menu';
import { LayoutService } from '../../services/app.layout/app.layout.service';
import { UserService } from '../../../main/services/user/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrl: './app.menu.component.scss',
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
    public userService: UserService
  ) {}
  ngAfterViewInit(): void {
    if (this._avatar) {
      this.avatarWidth = this._avatar.nativeElement.offsetWidth;
    } else {
      console.error('Avatar element not found!');
    }
    this.resetHideMenuTimeout();
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
    this.resetHideMenuTimeout();
    this.setModel();
    this.setOtherModel();
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
  setOtherModel() {
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

  setModel() {
    this.model = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-chart-line',
            routerLink: ['/'],
          },
          {
            label: 'Reports',
            icon: 'pi pi-chart-pie',
            routerLink: ['/report'],
          },
          {
            label: 'Administration',
            icon: 'pi pi-bars',
            items: [
              {
                label: 'Package',
                icon: 'pi pi-box',
                routerLink: ['/management/package'],
              },
              {
                label: 'Course',
                icon: 'pi pi-book',
                routerLink: ['/management/course'],
              },
              {
                label: 'Order',
                icon: 'pi pi-wallet',
                routerLink: ['/management/order'],
              },
              {
                label: 'User',
                icon: 'pi pi-user',
                items: [
                  {
                    label: 'Customer',
                    icon: 'pi pi-user',
                    routerLink: ['/management/user/customer'],
                  },
                  {
                    label: 'Provider',
                    icon: 'pi pi-user',
                    routerLink: ['/management/user/provider'],
                  },
                  {
                    label: 'Staff',
                    icon: 'pi pi-user',
                    routerLink: ['/management/user/staff'],
                  },
                ],
              },
            ],
          },
          {
            label: 'Application',
            icon: 'pi pi-bars',
            items: [
              {
                label: 'Schedule',
                icon: 'pi pi-calendar',
                routerLink: ['/management/schedule'],
              },
              {
                label: 'Feedback',
                icon: 'pi pi-comments',
                routerLink: ['/management/feedback'],
              },
              {
                label: 'Comment',
                icon: 'pi pi-comment',
                routerLink: ['/management/comment'],
              },
              {
                label: 'Blog',
                icon: 'pi pi-pencil',
                routerLink: ['/management/blog'],
              },
              {
                label: 'Voucher',
                icon: 'pi pi-tag',
                routerLink: ['/management/voucher'],
              },
              {
                label: 'Cart',
                icon: 'pi pi-shopping-cart',
                routerLink: ['/management/cart'],
              },
              {
                label: 'Order',
                icon: 'pi pi-shopping-bag',
                routerLink: ['/management/order'],
              },
              {
                label: 'OrderDetail',
                icon: 'pi pi-info',
                routerLink: ['/management/order-detail'],
              },
            ],
          },
        ],
      },

      // {
      //     label: 'UI Components',
      //     items: [
      //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
      //         { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
      //         { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
      //         { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
      //         { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
      //         { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
      //         { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
      //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
      //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
      //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
      //         { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
      //         { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
      //         { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
      //         { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
      //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
      //         { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
      //     ]
      // },
      // {
      //     label: 'Prime Blocks',
      //     items: [
      //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
      //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
      //     ]
      // },
      // {
      //     label: 'Utilities',
      //     items: [
      //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
      //         { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
      //     ]
      // },
      // {
      //     label: 'Pages',
      //     icon: 'pi pi-fw pi-briefcase',
      //     items: [
      //         {
      //             label: 'Landing',
      //             icon: 'pi pi-fw pi-globe',
      //             routerLink: ['/landing']
      //         },
      //         {
      //             label: 'Auth',
      //             icon: 'pi pi-fw pi-user',
      //             items: [
      //                 {
      //                     label: 'Login',
      //                     icon: 'pi pi-fw pi-sign-in',
      //                     routerLink: ['/auth/login']
      //                 },
      //                 {
      //                     label: 'Error',
      //                     icon: 'pi pi-fw pi-times-circle',
      //                     routerLink: ['/auth/error']
      //                 },
      //                 {
      //                     label: 'Access Denied',
      //                     icon: 'pi pi-fw pi-lock',
      //                     routerLink: ['/auth/access']
      //                 }
      //             ]
      //         },
      //         {
      //             label: 'Crud',
      //             icon: 'pi pi-fw pi-pencil',
      //             routerLink: ['/pages/crud']
      //         },
      //         {
      //             label: 'Timeline',
      //             icon: 'pi pi-fw pi-calendar',
      //             routerLink: ['/pages/timeline']
      //         },
      //         {
      //             label: 'Not Found',
      //             icon: 'pi pi-fw pi-exclamation-circle',
      //             routerLink: ['/notfound']
      //         },
      //         {
      //             label: 'Empty',
      //             icon: 'pi pi-fw pi-circle-off',
      //             routerLink: ['/pages/empty']
      //         },
      //     ]
      // },
      // {
      //     label: 'Hierarchy',
      //     items: [
      //         {
      //             label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
      //             items: [
      //                 {
      //                     label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
      //                     items: [
      //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
      //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
      //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
      //                     ]
      //                 },
      //                 {
      //                     label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
      //                     items: [
      //                         { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
      //                     ]
      //                 },
      //             ]
      //         },
      //         {
      //             label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
      //             items: [
      //                 {
      //                     label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
      //                     items: [
      //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
      //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
      //                     ]
      //                 },
      //                 {
      //                     label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
      //                     items: [
      //                         { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
      //                     ]
      //                 },
      //             ]
      //         }
      //     ]
      // },
      {
        label: 'Support',
        items: [
          {
            label: 'Documentation',
            icon: 'pi pi-fw pi-question',
            routerLink: ['/documentation'],
          },
          {
            label: 'View Source',
            icon: 'pi pi-fw pi-search',
            url: ['https://github.com/59saigon/smart-thrive-web-frontend'],
            target: '_blank',
          },
        ],
      },
    ];
  }
}
