import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LayoutService } from '../../services/app.layout/app.layout.service';
import { MenuItem } from 'primeng/api';
import { AppBreadcumbService } from '../../services/app.breadcumb.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConstantsTheme } from '../../../shared/constants/constant-theme';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: ['./app.topbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppTopbarComponent implements OnInit {
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  isMenuOpen = this.layoutService.isDesktop(); // Bắt đầu với trạng thái mặc định

  items: MenuItem[] = [];
  dashboard: MenuItem = { label: 'Home', url: undefined, route: undefined}; // Example home breadcrumb

  constructor(
    private breadcumbService: AppBreadcumbService,
    public layoutService: LayoutService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      
      this.updateBreadcrumbs();
    });

    this.updateBreadcrumbs();
  }

  updateBreadcrumbs(): void {
    this.dashboard['route'] = undefined;
    this.dashboard['url'] = '/dashboard';
    const segments = this.router.url.split('/').filter(segment => segment);
    const indexLastSegment = segments.length - 1;
    this.items = segments.map((segment, index) => {
      const url = '/' + segments.slice(0, index + 1).join('/');
      if (indexLastSegment != index) {
        return {
          label: segment,
          url: url
        };
      }

      return {
        label: segment,
        route: url
      };
    });

    // If the URL is just "/", set the home breadcrumb only
    if (this.items.length === 0 || this.router.url == "/dashboard" ) {
      this.dashboard['url'] = undefined;
      this.dashboard['route'] = '/dashboard';
      this.items = [this.dashboard];
    } else {
      // Optionally, prepend the home breadcrumb
      this.items = [this.dashboard, ...this.items];
    }
  }

  get mode(): boolean {
    var IsMode = this.layoutService.config().theme != ConstantsTheme.light ? true : false;

    return IsMode;
  }
  set mode(_val: boolean) {
    
      this.layoutService.config.update((config) => ({
        ...config,
        theme: _val ? ConstantsTheme.dark : ConstantsTheme.light,
      }));
    
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.layoutService.onMenuToggle();
  }
}
