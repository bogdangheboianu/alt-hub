import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSelectors } from '@auth/store/auth.selectors';
import { AppR } from '@shared/constants/routes';
import { firstValueFrom } from 'rxjs';

interface QuickActionCard {
    title: string;
    icon: string;
    command: () => any | Promise<any>;
    forAdmin: boolean;
}

@Component( {
                selector   : 'app-quick-action-cards',
                templateUrl: './quick-action-cards.component.html',
                styleUrls  : [ './quick-action-cards.component.scss' ]
            } )
export class QuickActionCardsComponent implements OnInit {
    quickActionCards: QuickActionCard[] = [
        {
            title   : 'My profile',
            icon    : 'account_box',
            forAdmin: false,
            command : () => this.goToProfilePage( false )
        },
        {
            title   : 'Log work',
            icon    : 'add_task',
            forAdmin: false,
            command : () => this.goToProfilePage( true )
        }
    ];

    constructor(
        private router: Router,
        private authSelectors: AuthSelectors
    ) {
    }

    ngOnInit(): void {
    }

    private async goToProfilePage(openWorkLogModal: boolean): Promise<void> {
        const loggedUser = await firstValueFrom( this.authSelectors.selectLoggedUser() );
        const url = `${ AppR.user.list.full }/${ loggedUser!.id }${ openWorkLogModal
                                                                    ? '?log-work=1'
                                                                    : '' }`;
        await this.router.navigateByUrl( url );
    }
}
