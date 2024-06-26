import { AfterViewInit, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';
import { Menu } from 'primeng/menu';
import { LayoutService } from '../../services/app.layout/app.layout.service';
import { UserService } from '../../../main/services/user/user.service';

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
    public userService: UserService
  ) { }
  ngAfterViewInit(): void {
    if (this._avatar) {
      this.avatarWidth = this._avatar.nativeElement.offsetWidth;
    } else {
      console.log('check_avatar', 'Avatar element not found!');
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
        label: 'Dashboards',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-chart-line',
            routerLink: ['/dashboard'],
          },
          {
            label: 'Reports',
            icon: 'pi pi-chart-pie',
            routerLink: ['/report'],
          },
        ],
      },
      {
        label: 'Apps',
        items: [
          {
            label: 'Package',
            icon: 'pi pi-box',
            routerLink: ['/apps/package'],
          },
          {
            label: 'Course',
            icon: 'pi pi-book',
            routerLink: ['/apps/course'],
          },
          {
            label: 'Order',
            icon: 'pi pi-wallet',
            routerLink: ['/apps/order'],
          },
          {
            label: 'User',
            icon: 'pi pi-user',
            routerLink: ['/apps/user'],
          },
        ]
      },

      {
        label: 'Application',
        
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
