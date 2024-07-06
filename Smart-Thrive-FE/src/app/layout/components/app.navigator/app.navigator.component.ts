import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AppBreadcumbService } from '../../services/app.breadcumb.service';
import { LayoutService } from '../../services/app.layout/app.layout.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navigator',
  templateUrl: './app.navigator.component.html',
  styleUrl: './app.navigator.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppNavigatorComponent {
  constructor(
    private breadcumbService: AppBreadcumbService,
    public layoutService: LayoutService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  items: MenuItem[] = [];
  dashboard: MenuItem = { label: 'Home', url: undefined, route: undefined};
  
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
        if (segment != 'apps') {
          return {
            label: segment,
            url: url
          };
        } else{
          return {
            label: segment,
            url: '/'
          };
        }
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
}
