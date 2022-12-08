import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SetPasswordDataService } from '@auth/features/set-password/set-password-data.service';
import { SetPassword } from '@auth/ui/set-password-form.component';
import { getQueryParamFromRoute } from '@shared/config/functions/route.functions';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';
import { firstValueFrom } from 'rxjs';

@Component( {
                selector       : 'app-set-password',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <div class="centered">
                            <app-container>
                                <app-set-password-form [loading]="data.loading"
                                                       (onSubmit)="activateUser($event)"></app-set-password-form>
                            </app-container>
                        </div>
                    </ng-container>
                `,
                styles         : [
                    `.centered {
                        width: 500px;
                        padding: 2.5rem 3rem;
                        margin: 6rem auto 0 auto;
                    }
                    `
                ],
                providers      : [ SetPasswordDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class SetPasswordComponent implements OnInit {
    constructor(
        public readonly dataService: SetPasswordDataService,
        private readonly navigationService: NavigationService,
        private readonly route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    activateUser(data: SetPassword): void {
        firstValueFrom( getQueryParamFromRoute( 'token', this.route ) )
            .then( token => {
                this.dataService.activateUser( { newPassword: data.password1, token } );
                this.onActivateUserSuccess();
            } );
    }

    private onActivateUserSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.navigationService.login();
        } );
    }
}
