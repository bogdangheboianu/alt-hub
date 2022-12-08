import { NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { AppR } from '@shared/config/constants/routes';

type MenuEntry = { title: string; routerLink: string; icon: string; forAdmin: boolean };

@Component( {
                standalone: true,
                selector  : 'app-side-menu',
                template  : `
                    <mat-sidenav-container class="sidenav-container">
                        <mat-sidenav class="sidenav"
                                     mode="side"
                                     opened
                                     [fixedInViewport]="true"
                                     [fixedTopGap]="50"
                                     [fixedBottomGap]="0">
                            <mat-nav-list>
                                <ng-container *ngFor="let entry of menuEntries">
                                    <a mat-list-item
                                       [routerLink]="entry.routerLink"
                                       [class.active-list-item]="isEntryActive(entry)"
                                       style="font-size: 13px; color: #5b5b5b"
                                       *ngIf="!entry.forAdmin || loggedUserIsAdmin">
                                        <mat-icon mat-list-icon>{{ entry.icon }}</mat-icon>
                                        <span>{{ entry.title }}</span>
                                    </a>
                                </ng-container>
                            </mat-nav-list>
                        </mat-sidenav>
                        <mat-sidenav-content class="container py-4">
                            <ng-content></ng-content>
                        </mat-sidenav-content>
                    </mat-sidenav-container>
                `,
                styles    : [
                    `mat-sidenav-content {
                        max-width: 87vw;
                    }

                    a.active-list-item {
                        background: rgba(206, 218, 255, 0.58);
                        color: #3F51B5 !important;
                        font-weight: bold;
                    }

                    a.active-list-item:hover {
                        background: rgba(206, 218, 255, 0.58);
                    }

                    .sidenav-container {
                        position: absolute;
                        top: 40px;
                        bottom: 10px;
                        left: 0;
                        right: 0;
                    }

                    .sidenav {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 201px;
                        background: #fff;
                        height: 100%;
                        padding-top: 7px;
                    }

                    :host ::ng-deep {
                        .mat-list-base .mat-list-item.mat-list-item-with-avatar, .mat-list-base .mat-list-option.mat-list-item-with-avatar {
                            height: 45px;
                        }

                        .mat-drawer-side {
                            border-right: none;
                        }

                        .mat-drawer-content {
                            background: #f6f6f6 !important;
                        }
                    }
                    `
                ],
                imports   : [
                    MatSidenavModule,
                    MatListModule,
                    RouterModule,
                    NgIf,
                    NgForOf,
                    MatIconModule
                ]
            } )
export class SideMenuComponent {
    @Input()
    loggedUserIsAdmin!: boolean;

    constructor(
        private readonly router: Router
    ) {
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
            },
            {
                title     : 'Vacations',
                routerLink: AppR.vacation.list.full,
                icon      : 'houseboat',
                forAdmin  : true
            }
        ];
    }

    isEntryActive(entry: MenuEntry): boolean {
        return this.router.url.includes( entry.routerLink );
    }
}
