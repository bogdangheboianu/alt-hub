import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatStep, MatStepper, MatStepperModule } from '@angular/material/stepper';
import { UserStatusEnum } from '@dtos/user-status-enum';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { ButtonModule } from '@shared/ui/button/button.module';
import { ContainerComponent } from '@shared/ui/container.component';
import { UserSuccessMessage } from '@users/config/user.constants';
import { UserOnboardingStepsDataService } from '@users/features/user-onboarding-steps/user-onboarding-steps-data.service';
import { UserStatusChangeButtonComponent } from '@users/ui/user-status-change-button.component';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { combineLatest, map, Observable } from 'rxjs';

@Component( {
                standalone     : true,
                selector       : 'app-user-onboarding-steps',
                template       : `
                    <div class="mb-3" *ngIf="(dataService.userIsOnboarding() | async)!">
                        <app-container>
                            <div class="d-flex align-items-center justify-content-between m-0 p-0" style="height: 100%">
                                <div class="w-100" style="height: 100%">
                                    <mat-stepper #stepper [selectedIndex]="(activeStepIndex | async)!" linear>
                                        <mat-step #createdStep [completed]="(createdStepCompleted | async)!" [editable]="false">
                                            <ng-template matStepLabel>Created</ng-template>
                                        </mat-step>
                                        <mat-step #invitedStep [completed]="(invitedStepCompleted | async)!" [editable]="false">
                                            <ng-template matStepLabel>Invited</ng-template>
                                        </mat-step>
                                        <mat-step #activatedStep [editable]="false">
                                            <ng-template matStepLabel>Activated</ng-template>
                                        </mat-step>
                                    </mat-stepper>
                                </div>
                                <div class="d-flex flex-column align-items-end justify-content-center">
                                    <app-user-status-change-button appButton
                                                                   [label]="(changeStatusButtonLabel | async)!"
                                                                   [disabled]="(changeStatusButtonDisabled | async)!"
                                                                   (onClick)="changeUserStatus()"></app-user-status-change-button>
                                </div>
                            </div>
                        </app-container>
                    </div>
                `,
                styles         : [
                    `
                        :host ::ng-deep {
                            .mat-horizontal-content-container {
                                padding: 0;
                                display: none;
                            }
                        }

                    `
                ],
                providers      : [ UserOnboardingStepsDataService ],
                imports        : [
                    ContainerComponent,
                    MatStepperModule,
                    CommonModule,
                    UserStatusChangeButtonComponent,
                    ButtonModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class UserOnboardingStepsComponent implements OnInit {
    @ViewChild( 'stepper' )
    stepper!: MatStepper;

    @ViewChild( 'invitedStep' )
    invitedStep!: MatStep;

    constructor(
        public readonly dataService: UserOnboardingStepsDataService,
        private readonly messageService: MessageService
    ) {
    }

    get activeStepIndex(): Observable<number> {
        return this.dataService.entity$
                   .pipe( map( user => Object.values( UserStatusEnum )
                                             .indexOf( user.account.status ) ) );
    }

    get createdStepCompleted(): Observable<boolean> {
        return this.statusIsOneOf( UserStatusEnum.Invited, UserStatusEnum.Active );
    }

    get invitedStepCompleted(): Observable<boolean> {
        return this.statusIsOneOf( UserStatusEnum.Active );
    }

    get changeStatusButtonLabel(): Observable<string> {
        return this.dataService.entity$
                   .pipe( map( user => {
                       switch( user.account.status ) {
                           case UserStatusEnum.Created:
                               return 'Invite';
                           case UserStatusEnum.Invited:
                               return 'Awaiting confirmation';
                           default:
                               return '';
                       }
                   } ) );
    }

    get changeStatusButtonDisabled(): Observable<boolean> {
        const hasStatusWithDisabledButton$ = this.dataService.entity$
                                                 .pipe( map( user => [
                                                     UserStatusEnum.Active,
                                                     UserStatusEnum.Invited,
                                                     UserStatusEnum.Inactive
                                                 ].includes( user.account.status ) ) );
        const isLoading$ = this.dataService.source!.loading;

        return combineLatest( [ hasStatusWithDisabledButton$, isLoading$ ] )
            .pipe( map( ([ hasStatusWithDisabledButton, isLoading ]) => hasStatusWithDisabledButton || isLoading ) );
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    changeUserStatus(): void {
        this.dataService.entity
            .then( user => {
                switch( user.account.status ) {
                    case UserStatusEnum.Created:
                        this.inviteUser();
                        break;
                    default:
                        break;
                }
            } );
    }

    private inviteUser(): void {
        this.dataService.inviteUser();
        this.onUserInvitedSuccess();
    }

    private onUserInvitedSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.messageService.success( UserSuccessMessage.Invited );
            this.invitedStep.completed = true;
            this.stepper.next();
        } );
    }

    private statusIsOneOf(...statuses: UserStatusEnum[]): Observable<boolean> {
        return this.dataService.entity$
                   .pipe( map( user => statuses.some( s => s === user.account.status ) ) );
    }
}
