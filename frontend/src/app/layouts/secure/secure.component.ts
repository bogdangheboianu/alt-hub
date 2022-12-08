import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthActions } from '@auth/data/auth.actions';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { NavigationService } from '@shared/features/navigation/navigation.service';

@Component( {
                selector       : 'app-secure',
                template       : `
                    <app-top-bar *ngIf="(authSelectors.selectLoggedUser() | async )! as user"
                                 [user]="user"
                                 (onProfileClick)="navigationService.userDetails(user.id)"
                                 (onLogoutButtonClick)="authActions.logout()"></app-top-bar>
                    <app-side-menu [loggedUserIsAdmin]="(authSelectors.isLoggedUserAdmin() | async)!">
                        <router-outlet></router-outlet>
                    </app-side-menu>
                `,
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class SecureComponent {
    constructor(
        public readonly authActions: AuthActions,
        public readonly authSelectors: AuthSelectors,
        public readonly navigationService: NavigationService
    ) {
    }
}
