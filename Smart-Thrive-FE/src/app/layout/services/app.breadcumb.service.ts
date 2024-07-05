import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class AppBreadcumbService {
    items: MenuItem[] = [];

    getItemsDashboard(): MenuItem[] {
        this.items = [];
        this.items = [
            {label: 'apps'},
            {label: 'course', route: '/apps/course'},
            {label: 'user', route: '/apps/user'},
            {label: 'provider', route: '/apps/user/provider'},
            {label: 'student', route: '/apps/user/student'},
            {label: 'package', route: '/apps/package'},
            {label: 'order', route: '/apps/order'},
            {label: 'session', route: '/apps/session'},
            {label: 'subject', route: '/apps/subject'},
        ]

        return this.items;
    }
 }
