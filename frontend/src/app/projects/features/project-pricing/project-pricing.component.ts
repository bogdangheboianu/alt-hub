import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UpdateProjectPricingDto } from '@dtos/update-project-pricing-dto';
import { ProjectSuccessMessage } from '@projects/config/project.constants';
import { ProjectPricingUpdateFormModalData } from '@projects/config/project.interfaces';
import { ProjectDataModule } from '@projects/data/project-data.module';
import { ProjectPricingDataService } from '@projects/features/project-pricing/project-pricing-data.service';
import { ProjectPricingUpdateFormComponent } from '@projects/ui/project-pricing-update-form.component';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { ModalService } from '@shared/features/modal/modal.service';
import { SharedPipesModule } from '@shared/pipes/shared.pipes.module';
import { ButtonModule } from '@shared/ui/button/button.module';
import { EditButtonComponent } from '@shared/ui/button/edit-button.component';
import { ContainerComponent } from '@shared/ui/container.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                standalone     : true,
                selector       : 'app-project-pricing',
                template       : `
                    <app-container *ngIf="(dataService.data$ | async)! as data" height="115px">
                        <div *ngIf="data.entity?.pricing as pricing" class="d-flex align-items-center justify-content-between">
                            <ng-container [ngSwitch]="pricing.type">
                                <ng-container *ngSwitchCase="'fixed_price'">
                                    <div class="d-flex align-items-center justify-content-start">
                                        <mat-icon class="money-icon">attach_money</mat-icon>
                                        <div class="d-flex flex-column align-items-start justify-content-center">
                                            <span class="pricing-type">Fixed price</span>
                                            <span class="pricing-amount">{{ pricing.fixedPrice | moneyAmount}} {{ pricing.fixedPrice.currency }}</span>
                                        </div>
                                    </div>
                                </ng-container>
                                <ng-container *ngSwitchCase="'time_and_material'">
                                    <div class="d-flex align-items-center justify-content-start">
                                        <mat-icon class="money-icon">attach_money</mat-icon>
                                        <div class="d-flex flex-column align-items-start justify-content-center">
                                            <span class="pricing-type">Time and material</span>
                                            <span class="pricing-amount">{{ pricing.hourlyRate | moneyAmount}} {{ pricing.hourlyRate.currency }}/hr</span>
                                        </div>
                                    </div>
                                </ng-container>
                                <ng-container *ngSwitchDefault>
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="d-flex align-items-center justify-content-start">
                                            <mat-icon class="money-icon danger">money_off</mat-icon>
                                            <span class="no-pricing">No pricing set</span>
                                        </div>
                                    </div>
                                </ng-container>
                            </ng-container>
                            <app-edit-button
                                appButton
                                [iconOnly]="true"
                                (onClick)="openProjectPricingUpdateFormModal()"></app-edit-button>
                        </div>
                    </app-container>
                `,
                styles         : [
                    `
                        :host ::ng-deep {
                            mat-icon.money-icon {
                                height: 60px;
                                width: 60px;
                                font-size: 60px;
                                line-height: 60px;
                                color: #00BD97;
                            }

                            mat-icon.money-icon.danger {
                                color: #f44336;
                            }

                            .pricing-type {
                                font-size: 20px;
                                color: #5a5a5a;
                            }

                            .pricing-amount {
                                font-size: 15px;
                                color: #2f2C36;
                                font-weight: bold;
                            }

                            .no-pricing {
                                font-size: 20px;
                                color: #5a5a5a;
                                font-style: italic;
                            }
                        }
                    `
                ],
                providers      : [ ProjectPricingDataService ],
                imports        : [
                    ProjectDataModule,
                    CommonModule,
                    ContainerComponent,
                    MatIconModule,
                    SharedPipesModule,
                    EditButtonComponent,
                    ButtonModule,
                    ProjectPricingUpdateFormComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectPricingComponent implements OnInit {
    constructor(
        public readonly dataService: ProjectPricingDataService,
        private readonly modalService: ModalService,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    openProjectPricingUpdateFormModal(): void {
        this.dataService.entity.then( project => this.modalService.openSmModal<ProjectPricingUpdateFormModalData>(
            ProjectPricingUpdateFormComponent,
            this,
            {
                initialValues: project.pricing,
                loading$     : this.dataService.source!.loading,
                onSubmit     : this.updateProjectPricing.bind( this ),
                onCancel     : this.closeProjectPricingUpdateFormModal.bind( this )
            }
        ) );
    }

    closeProjectPricingUpdateFormModal(): void {
        this.modalService.close( ProjectPricingUpdateFormComponent );
    }

    updateProjectPricing(data: UpdateProjectPricingDto): void {
        this.dataService.updateProjectPricing( data );
        this.onProjectPricingUpdateSuccess();
    }

    private onProjectPricingUpdateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( ProjectSuccessMessage.PricingUpdated );
            this.closeProjectPricingUpdateFormModal();
        } );
    }
}
