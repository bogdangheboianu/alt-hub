import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { HttpErrorResponseDto } from '@dtos/http-error-response-dto';

@Component( {
                selector       : 'app-error-message',
                template       : `
                    <div class="d-flex flex-column align-items-start justify-content-center">
                        <strong>{{ error.message }}</strong>
                        <ng-container [ngSwitch]="error.statusCode">
                            <ng-container *ngSwitchCase="500">
                                <p style="padding: 0; margin: 0">Something went wrong</p>
                            </ng-container>
                            <ng-container *ngSwitchCase="401">
                                <p style="padding: 0; margin: 0">You are not authorized to perform this action</p>
                            </ng-container>
                            <ng-container *ngSwitchCase="403">
                                <p style="padding: 0; margin: 0">Action not allowed</p>
                            </ng-container>
                            <ng-container *ngSwitchDefault>
                                <p *ngFor="let err of error.errors" style="padding: 0; margin: 0">{{ err.message }}</p>
                            </ng-container>
                        </ng-container>
                    </div>
                `,
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class ErrorMessageComponent {
    constructor(@Inject( MAT_SNACK_BAR_DATA ) public readonly error: HttpErrorResponseDto) {
    }
}
