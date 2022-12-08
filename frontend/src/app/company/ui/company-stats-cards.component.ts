import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AppR } from '@shared/config/constants/routes';
import { ContainerComponent } from '@shared/ui/container.component';

type CompanyStatsCard = {
    tooltip: string;
    total: number;
    icon: string;
    command: () => Promise<void>
}

@Component( {
                standalone     : true,
                selector       : 'app-company-stats-cards',
                template       : `
                    <div class="row mb-3">
                        <ng-container *ngFor="let card of cards">
                            <div class="col-3">
                                <app-container [matTooltip]="card.tooltip"
                                               [clickable]="true"
                                               (onClick)="card.command()">
                                    <div class="stats-card">
                                        <mat-icon class="icon">{{ card.icon }}</mat-icon>
                                        <h1 class="number">{{ card.total }}</h1>
                                    </div>
                                </app-container>
                            </div>
                        </ng-container>
                    </div>
                `,
                styles         : [
                    `:host ::ng-deep {
                        .stats-card {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            cursor: pointer;
                        }

                        .stats-card > mat-icon.icon,
                        .stats-card > h1.number {
                            margin: 0;
                            padding: 0;
                            font-size: 40px;
                            line-height: 40px;
                        }

                        .stats-card > mat-icon.icon {
                            color: #5b5b5b;
                            height: 40px;
                            width: auto;
                        }

                        .stats-card > h1.number {
                            font-weight: bolder;
                            color: #5e3bff
                        }
                    }
                    `
                ],
                imports        : [
                    NgForOf,
                    ContainerComponent,
                    MatTooltipModule,
                    MatIconModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class CompanyStatsCardsComponent {
    cards: CompanyStatsCard[] = [
        {
            tooltip: 'Employees',
            total  : 78,
            icon   : 'group',
            command: () => this.goToUserListPage()
        },
        {
            tooltip: 'Projects',
            total  : 101,
            icon   : 'assignment',
            command: () => this.goToProjectListPage()
        },
        {
            tooltip: 'Clients',
            total  : 56,
            icon   : 'work',
            command: () => this.goToClientListPage()
        },
        {
            tooltip: 'Work logs',
            total  : 1089,
            icon   : 'add_task',
            command: () => this.goToWorkLogListPage()
        }
    ];

    constructor(private router: Router) {
    }

    async goToUserListPage(): Promise<void> {
        await this.router.navigateByUrl( AppR.user.list.full );
    }

    async goToProjectListPage(): Promise<void> {
        await this.router.navigateByUrl( AppR.project.list.full );
    }

    async goToClientListPage(): Promise<void> {
        await this.router.navigateByUrl( AppR.client.list.full );
    }

    async goToWorkLogListPage(): Promise<void> {
        await this.router.navigateByUrl( AppR.workLog.list.full );
    }
}


