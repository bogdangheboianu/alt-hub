import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoginDataService } from '@auth/features/login/login-data.service';
import { LoginWithCredentialsDto } from '@dtos/login-with-credentials-dto';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector       : 'app-login',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <div class="card-container">
                            <mat-card class="login-card">
                                <mat-card-header class="login-header">
                                    <img class="logo" src="../../../../assets/logos/logo-long-white.svg" alt="logo" />
                                </mat-card-header>

                                <div class="form-container">
                                    <h1 class="login-text">Welcome</h1>
                                    <app-login-form [loading]="data.loading"
                                                    (onSubmit)="login($event)"></app-login-form>
                                </div>
                            </mat-card>
                        </div>
                    </ng-container>
                `,
                styles         : [
                    `@use "../../../../styles/styles" as styles;

                    .login-card {
                        width: 50%;
                        max-width: 500px;
                        height: 440px;
                        margin: 0 auto;
                        padding: 0;
                        position: relative;
                        top: 128px;
                    }

                    .login-header {
                        background: styles.$primary-gradient;
                        padding: 16px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .logo {
                        display: block;
                        height: 40px;
                    }

                    .form-container {
                        padding: 32px;
                        text-align: center;
                    }

                    .login-text {
                        padding-bottom: 32px;
                        font-weight: 700;
                        font-size: 32px;
                    }

                    @media only screen and (max-width: 600px) {
                        .login-text {
                            padding: 32px 32px 64px 32px;
                            font-weight: 600;
                            font-size: 32px;
                        }
                        .login-card {
                            width: 100%;
                            max-width: 800px;
                            height: 100vh;
                            position: relative;
                            top: 0;
                            margin: 0 auto;
                            padding: 0;
                        }
                    }
                    `
                ],
                providers      : [ LoginDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class LoginComponent implements OnInit {
    constructor(
        public readonly dataService: LoginDataService,
        private readonly navigationService: NavigationService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    login(data: LoginWithCredentialsDto): void {
        this.dataService.login( data );
        this.onLoginSuccess();
    }

    private onLoginSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.navigationService.dashboard();
        } );
    }
}
