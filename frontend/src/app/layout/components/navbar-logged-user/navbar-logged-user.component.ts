import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthActions } from '@auth/store/auth.actions';
import { AuthSelectors } from '@auth/store/auth.selectors';
import { AppR } from '@shared/constants/routes';
import { UserDto } from '@dtos/user.dto';
import { takeIfDefined } from '@shared/custom-rxjs-operators';
import { firstValueFrom, Observable } from 'rxjs';

type ExpandIcon = 'expand_more' | 'expand_less'

@Component( {
                selector   : 'app-navbar-logged-user',
                templateUrl: './navbar-logged-user.component.html',
                styleUrls  : [ './navbar-logged-user.component.scss' ]
            } )
export class NavbarLoggedUserComponent implements OnInit {
    @ViewChild( MatMenuTrigger ) dropdownMenuTrigger!: MatMenuTrigger;

    loggedUser$!: Observable<UserDto>;
    dropdownMenuOpened = false;

    constructor(
        private readonly authSelectors: AuthSelectors,
        private readonly authActions: AuthActions,
        private readonly router: Router
    ) {
    }

    ngOnInit(): void {
        this.loggedUser$ = this.authSelectors.selectLoggedUser()
                               .pipe( takeIfDefined );
    }

    get expandIcon(): ExpandIcon {
        return this.dropdownMenuOpened
               ? 'expand_less'
               : 'expand_more';
    }

    openDropdownMenu(): void {
        this.dropdownMenuTrigger.openMenu();
        this.dropdownMenuOpened = true;
    }

    onDropdownMenuClosed(): void {
        this.dropdownMenuOpened = false;
    }

    async goToLoggedUserPage(): Promise<void> {
        const loggedUser = await firstValueFrom( this.loggedUser$ );
        await this.router.navigateByUrl( `${ AppR.user.list.full }/${ loggedUser!.id }` );
    }

    async logout(): Promise<void> {
        await this.authActions.logout();
    }
}
