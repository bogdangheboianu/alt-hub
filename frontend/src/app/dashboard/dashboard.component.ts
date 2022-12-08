import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DashboardDataService } from '@dashboard/dashboard-data.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { QuickActionCards } from '@shared/ui/quick-action-card.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { firstValueFrom } from 'rxjs';

@Component( {
                selector       : 'app-dashboard',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <div class="row mb-3">
                            <ng-container *ngFor="let card of quickActionCards">
                                <div class="col-2">
                                    <app-quick-action-card [data]="card"></app-quick-action-card>
                                </div>
                            </ng-container>
                        </div>
                        <mat-divider></mat-divider>
                        <!--                        <div class="placeholder-container">-->
                        <!--                            <h1 class="placeholder-text">Altamira</h1>-->
                        <!--                        </div>-->
                    </ng-container>
                `,
                styles         : [
                    `
                        .placeholder-container {
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .placeholder-text {
                            color: mix(#fff, #c1c1c1, 85%);
                            font-size: calc(10em + 20vw);
                            font-weight: 900;
                            text-shadow: -0.0075em 0.0075em 0 mix(#fff, #c1c1c1, 94%),
                            0.005em 0.005em 0 mix(#fff, #c1c1c1, 60%),
                            0.01em 0.01em 0 mix(#fff, #c1c1c1, 62%),
                            0.015em 0.015em mix(#fff, #c1c1c1, 64%),
                            0.02em 0.02em 0 mix(#fff, #c1c1c1, 66%),
                            0.025em 0.025em 0 mix(#fff, #c1c1c1, 68%),
                            0.03em 0.03em 0 mix(#fff, #c1c1c1, 70%),
                            0.035em 0.035em 0 mix(#fff, #c1c1c1, 72%);
                        }
                    `
                ],
                providers      : [ DashboardDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class DashboardComponent implements OnInit {
    quickActionCards: QuickActionCards = [];

    constructor(
        public readonly dataService: DashboardDataService,
        private readonly navigationService: NavigationService
    ) {
        this.quickActionCards = this.getQuickActionCards();
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    private goToProfilePage(openWorkLogModal: boolean): void {
        firstValueFrom( this.dataService.source!.loggedUser )
            .then( loggedUser => {
                if( openWorkLogModal ) {
                    this.dataService.openWorkLogCreateFormModal();
                }

                this.navigationService.userDetails( loggedUser.id );
            } );
    }

    private getQuickActionCards(): QuickActionCards {
        return [
            {
                title  : 'My profile',
                icon   : 'account_box',
                visible: true,
                command: () => this.goToProfilePage( false )
            },
            {
                title  : 'Log work',
                icon   : 'add_task',
                visible: true,
                command: () => this.goToProfilePage( true )
            }
        ];
    }
}


