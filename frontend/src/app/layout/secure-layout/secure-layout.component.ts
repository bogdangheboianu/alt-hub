import { Component } from '@angular/core';
import { AppR } from '@shared/constants/routes';

interface MenuItem {
    title: string;
    routerLink: string;
}

@Component( {
                selector   : 'app-secure-layout',
                templateUrl: './secure-layout.component.html',
                styleUrls  : [ './secure-layout.component.scss' ]
            } )
export class SecureLayoutComponent {
    get menuItems(): MenuItem[] {
        return [
            {
                title     : 'Dashboard',
                routerLink: AppR.dashboard.full
            },
            {
                title     : 'Employees',
                routerLink: AppR.user.list.full
            },
            {
                title     : 'Clients',
                routerLink: AppR.client.list.full
            },
            {
                title     : 'Projects',
                routerLink: AppR.project.list.full
            }
        ];
    }
}
