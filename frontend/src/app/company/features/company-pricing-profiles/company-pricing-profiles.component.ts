import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CompanySuccessMessage } from '@company/config/company.constants';
import { CompanyPricingProfileCreateFormModalData } from '@company/config/company.interfaces';
import { CompanyDataModule } from '@company/data/company-data.module';
import { CompanyPricingProfilesDataService } from '@company/features/company-pricing-profiles/company-pricing-profiles-data.service';
import { CompanyPricingProfileCreateFormComponent } from '@company/ui/company-pricing-profile-create-form.component';
import { CreateCompanyPricingProfileDto } from '@dtos/create-company-pricing-profile-dto';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { ModalModule } from '@shared/features/modal/modal.module';
import { ModalService } from '@shared/features/modal/modal.service';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { ButtonModule } from '@shared/ui/button/button.module';
import { CreateButtonComponent } from '@shared/ui/button/create-button.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { LoadingBarComponent } from '@shared/ui/loading-bar.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-company-pricing-profiles',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-container>
                            <app-section-title
                                containerHeaderRight
                                title="Pricing profiles"
                                icon="request_quote"
                                [withMarginBottom]="false"></app-section-title>
                            <app-create-button
                                containerHeaderRight
                                appButton
                                [iconOnly]="true"
                                (onClick)="openPricingProfileCreateFormModal()"></app-create-button>
                            <app-loading-bar [visible]="data.loading"></app-loading-bar>
                            <mat-list role="list">
                                <mat-list-item role="listitem" *ngFor="let pricingProfile of data.pricingProfiles; let i = index">
                                    <div class="w-100 d-flex align-items-center justify-content-between" style="padding: 10px 0">
                                        <div class="d-flex align-items-center justify-content-start">
                                            <div class="d-flex flex-column">
                                                <span>{{ pricingProfile.name }}</span>
                                                <span style="font-size: 12px; color: gray">
                                                    <strong style="color: #a930c7">{{ pricingProfile.position.name }}</strong> | {{ pricingProfile.hourlyRate | moneyAmount }} {{ pricingProfile.hourlyRate.currency }}/hr
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <mat-divider *ngIf="i !== data.pricingProfiles.length - 1"></mat-divider>
                                </mat-list-item>
                            </mat-list>
                        </app-container>
                    </ng-container>
                `,
                styles         : [
                    `:host ::ng-deep {
                        .mat-list-base .mat-list-item .mat-list-item-content, .mat-list-base .mat-list-option .mat-list-item-content {
                            padding: 0 !important;
                        }

                        .mat-list-base .mat-list-item, .mat-list-base .mat-list-option {
                            height: auto;
                        }
                    }`
                ],
                providers      : [ CompanyPricingProfilesDataService ],
                imports        : [
                    CommonModule,
                    CompanyDataModule,
                    SectionTitleComponent,
                    ContainerComponent,
                    CreateButtonComponent,
                    ButtonModule,
                    CompanyPricingProfileCreateFormComponent,
                    ModalModule,
                    MatListModule,
                    LoadingBarComponent,
                    SharedPipesModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class CompanyPricingProfilesComponent implements OnInit {
    constructor(
        public readonly dataService: CompanyPricingProfilesDataService,
        private readonly modalService: ModalService,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    openPricingProfileCreateFormModal(): void {
        this.modalService.openSmModal<CompanyPricingProfileCreateFormModalData>( CompanyPricingProfileCreateFormComponent, this, {
            companyPositions$       : this.dataService.source!.positionsSelectInputOptions,
            companyPositionsLoading$: this.dataService.source!.loading,
            loading$                : this.dataService.source!.loading,
            onSubmit                : this.createPricingProfile.bind( this ),
            onCancel                : this.closePricingProfileCreateFormModal.bind( this )
        } );
    }

    createPricingProfile(data: CreateCompanyPricingProfileDto): void {
        this.dataService.createCompanyPricingProfile( data );
        this.onPricingProfileCreateSuccess();
    }

    closePricingProfileCreateFormModal(): void {
        this.modalService.close( CompanyPricingProfileCreateFormComponent );
    }

    private onPricingProfileCreateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.closePricingProfileCreateFormModal();
            this.messageService.success( CompanySuccessMessage.PricingProfileAdded );
        } );
    }
}
