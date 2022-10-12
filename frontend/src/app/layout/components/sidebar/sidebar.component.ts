import { Component } from '@angular/core';
import { AuthSelectors } from '@auth/store/auth.selectors';
import { AppR } from '@shared/constants/routes';
import { Observable } from 'rxjs';

type MenuEntry = { title: string; routerLink: string; icon: string; forAdmin: boolean };

@Component( {
                selector   : 'app-sidebar',
                templateUrl: './sidebar.component.html',
                styleUrls  : [ './sidebar.component.scss' ]
            } )
export class SidebarComponent {
    constructor(private readonly authSelectors: AuthSelectors) {
    }

    get menuEntries(): MenuEntry[] {
        return [
            {
                title     : 'Dashboard',
                routerLink: AppR.dashboard.full,
                icon      : 'dashboard',
                forAdmin  : false
            },
            {
                title     : 'Company',
                routerLink: AppR.company.full,
                icon      : 'business',
                forAdmin  : true
            },
            {
                title     : 'Employees',
                routerLink: AppR.user.list.full,
                icon      : 'group',
                forAdmin  : true
            },
            {
                title     : 'Projects',
                routerLink: AppR.project.list.full,
                icon      : 'assignment',
                forAdmin  : false
            },
            {
                title     : 'Clients',
                routerLink: AppR.client.list.full,
                icon      : 'work',
                forAdmin  : true
            },
            {
                title     : 'Work logs',
                routerLink: AppR.workLog.list.full,
                icon      : 'add_task',
                forAdmin  : true
            }
        ];
    }

    get loggedUserIsAdmin(): Observable<boolean> {
        return this.authSelectors.isLoggedUserAdmin();
    }
}
