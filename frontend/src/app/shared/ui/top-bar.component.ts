import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { UserDto } from '@dtos/user-dto';
import { GlobalSearchComponent } from '@search/features/global-search/global-search.component';
import { AppR } from '@shared/config/constants/routes';
import { UserTopBarMenuComponent } from '@users/ui/user-top-bar-menu.component';

@Component( {
                standalone     : true,
                selector       : 'app-top-bar',
                template       : `
                    <mat-toolbar class="app-navbar shadow-sm">
                        <div class="w-100 h-100">
                            <div class="d-flex align-items-center justify-content-between h-100">
                                <div class="d-flex align-items-center justify-content-start h-100">
                                    <h1 class="m-0 p-0 text-center logo" [routerLink]="dashboardLink">Altamira Hub</h1>
                                    <div style="margin-left: 15px">
                                        <app-global-search></app-global-search>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-end h-100 px-2">
                                    <app-user-top-bar-menu
                                        [user]="user"
                                        (onProfileClick)="onProfileClick.emit($event)"
                                        (onLogoutButtonClick)="onLogoutButtonClick.emit($event)"></app-user-top-bar-menu>
                                </div>
                            </div>
                        </div>
                    </mat-toolbar>
                `,
                styles         : [
                    `.app-navbar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 50px;
                        background: #fff;
                        padding: 0;
                        z-index: 3;
                    }

                    .logo {
                        width: 200px;
                        font-weight: bolder;
                        letter-spacing: 2px;
                        font-family: 'Ubuntu', sans-serif;
                        cursor: pointer;
                        background: #3F51B5;
                        background: linear-gradient(to right, #3F51B5 8%, #FF4081 73%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    .logo:hover {
                        background: #FF4081;
                        background: linear-gradient(to right, #FF4081 8%, #3F51B5 73%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }`
                ],
                imports        : [
                    MatToolbarModule,
                    GlobalSearchComponent,
                    RouterModule,
                    UserTopBarMenuComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class TopBarComponent {
    @Input()
    user!: UserDto;

    @Output()
    onProfileClick = new EventEmitter();

    @Output()
    onLogoutButtonClick = new EventEmitter();

    get dashboardLink(): string {
        return AppR.dashboard.full;
    }
}
