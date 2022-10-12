import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { MessageService } from '@shared/services/message.service';
import { UserStatusEnum } from '@dtos/user-status.enum';
import { UserDto } from '@dtos/user.dto';
import { takeIfTrue } from '@shared/custom-rxjs-operators';
import { UserOperationMessage } from '@user/constants/user-operation-message.enum';
import { UserActions } from '@user/store/user.actions';
import { UserSelectors } from '@user/store/user.selectors';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { filter } from 'rxjs';

@Component( {
                selector   : 'app-user-status-steps',
                templateUrl: './user-status-steps.component.html',
                styleUrls  : [ './user-status-steps.component.scss' ]
            } )
@UntilDestroy()
export class UserStatusStepsComponent implements OnInit {
    @ViewChild( 'stepper' )
    stepper!: MatStepper;

    @ViewChild( 'createdStep' )
    createdStep!: MatStep;

    @ViewChild( 'invitedStep' )
    invitedStep!: MatStep;

    @ViewChild( 'confirmedStep' )
    confirmedStep!: MatStep;

    @ViewChild( 'activatedStep' )
    activatedStep!: MatStep;

    @Input() user!: UserDto;

    constructor(
        private readonly userActions: UserActions,
        private readonly userSelectors: UserSelectors,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.onUserInvitedSuccess();
        this.onUserActivatedSuccess();
    }

    changeUserStatus(): void {
        switch( this.user.status ) {
            case UserStatusEnum.Created:
                this.inviteUser();
                break;
            case UserStatusEnum.Confirmed:
                this.activateUser();
                break;
            default:
                break;
        }
    }

    getActiveStatusStep(): number {
        return Object.values( UserStatusEnum )
                     .indexOf( this.user.status );
    }

    isCreatedStepCompleted(): boolean {
        return this.currentUserStatusIsOneOf( UserStatusEnum.Invited, UserStatusEnum.Confirmed, UserStatusEnum.Active );
    }

    isInvitedStepCompleted(): boolean {
        return this.currentUserStatusIsOneOf( UserStatusEnum.Confirmed, UserStatusEnum.Active );
    }

    isConfirmedStepCompleted(): boolean {
        return this.currentUserStatusIsOneOf( UserStatusEnum.Active );
    }

    private inviteUser(): void {
        this.userActions.inviteUser( this.user.id );
    }

    private activateUser(): void {
        this.userActions.activateUser( this.user.id );
    }

    private currentUserStatusIsOneOf(...statuses: UserStatusEnum[]): boolean {
        return statuses.some( s => s === this.user.status );
    }

    private onUserInvitedSuccess(): void {
        this.userSelectors.selectSuccess()
            .pipe(
                takeUntilDestroy( this ),
                takeIfTrue,
                filter( () => this.currentUserStatusIsOneOf( UserStatusEnum.Invited ) )
            )
            .subscribe( () => {
                this.messageService.success( UserOperationMessage.Invited );
                this.invitedStep.completed = true;
                this.stepper.next();
            } );
    }

    private onUserActivatedSuccess(): void {
        this.userSelectors.selectSuccess()
            .pipe(
                takeUntilDestroy( this ),
                takeIfTrue,
                filter( () => this.currentUserStatusIsOneOf( UserStatusEnum.Active ) )
            )
            .subscribe( () => {
                this.messageService.success( UserOperationMessage.Activated );
                this.invitedStep.completed = true;
                this.stepper.next();
            } );
    }
}
