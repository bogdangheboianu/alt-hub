import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CompanyDetailsDataService } from '@company/features/company-details/company-details-data.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector       : 'app-company-details',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-loading-bar [visible]="data.loading"></app-loading-bar>
                        <ng-container *ngIf="data.entity as company">
                            <app-container>
                                <app-title icon="business" [title]="company.name"></app-title>
                            </app-container>
                            <div class="mt-3">
                                <app-company-stats-cards></app-company-stats-cards>
                            </div>
                            <mat-divider></mat-divider>
                            <div class="row mt-3" style="row-gap: 1.5rem">
                                <section class="col-6">
                                    <app-company-positions></app-company-positions>
                                </section>
                                <section class="col-6">
                                    <app-company-pricing-profiles></app-company-pricing-profiles>
                                </section>
                                <section class="col-6">
                                    <app-company-documents></app-company-documents>
                                </section>
                            </div>
                        </ng-container>
                    </ng-container>
                `,
                providers      : [ CompanyDetailsDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class CompanyDetailsComponent implements OnInit {
    constructor(public readonly dataService: CompanyDetailsDataService) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }
}
