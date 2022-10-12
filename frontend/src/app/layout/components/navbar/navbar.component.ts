import { Component } from '@angular/core';
import { AppR } from '@shared/constants/routes';

@Component( {
                selector   : 'app-navbar',
                templateUrl: './navbar.component.html',
                styleUrls  : [ './navbar.component.scss' ]
            } )
export class NavbarComponent {
    get dashboardLink(): string {
        return AppR.dashboard.full;
    }
}
