import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { CompanySuccessMessage } from '@company/config/company.constants';
import { CompanyDataModule } from '@company/data/company-data.module';
import { CompanyPositionsDataService } from '@company/features/company-positions/company-positions-data.service';
import { CompanyPositionCreateFormComponent } from '@company/ui/company-position-create-form.component';
import { CreateCompanyPositionDto } from '@dtos/create-company-position-dto';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { ContainerComponent } from '@shared/ui/container.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-company-positions',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-container>
                            <app-section-title containerHeaderLeft title="Positions" icon="badge"></app-section-title>
                            <div class="mb-2">
                                <app-company-position-create-form [loading]="data.loading"
                                                                  (onSubmit)="createCompanyPosition($event)"></app-company-position-create-form>
                            </div>
                            <app-loading-bar [visible]="data.loading"></app-loading-bar>
                            <mat-list role="list">
                                <mat-list-item role="listitem" *ngFor="let position of data.companyPositions; let i = index">
                                    <div class="w-100 d-flex align-items-center justify-content-between">
                                        <div class="d-flex align-items-center justify-content-start">
                                            <div class="d-flex flex-column">
                                                <span>{{ position.name }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <mat-divider *ngIf="i !== data.companyPositions.length - 1"></mat-divider>
                                </mat-list-item>
                            </mat-list>
                        </app-container>
                    </ng-container>
                `,
                styles         : [
                    `:host ::ng-deep .mat-list-base .mat-list-item .mat-list-item-content, .mat-list-base .mat-list-option .mat-list-item-content {
                        padding: 0 !important;
                    }`
                ],
                providers      : [ CompanyPositionsDataService ],
                imports        : [
                    CommonModule,
                    MatTableModule,
                    MatRippleModule,
                    CompanyPositionCreateFormComponent,
                    LoadingBarComponent,
                    CompanyDataModule,
                    SectionTitleComponent,
                    ContainerComponent,
                    MatListModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class CompanyPositionsComponent implements OnInit {
    @ViewChild( CompanyPositionCreateFormComponent )
    companyPositionCreateForm!: CompanyPositionCreateFormComponent;

    constructor(
        public readonly dataService: CompanyPositionsDataService,
        private readonly messageService: MessageService
    ) {
    }

    displayedColumns = [ 'name' ];

    ngOnInit(): void {
        this.dataService.init( this );
    }

    createCompanyPosition(data: CreateCompanyPositionDto): void {
        this.dataService.createCompanyPosition( data );
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( CompanySuccessMessage.PositionAdded );
            this.companyPositionCreateForm.reset();
        } );
    }
}
