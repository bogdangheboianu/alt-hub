import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component( {
                standalone     : true,
                selector       : 'app-loading-spinner',
                template       : ' <mat-progress-spinner *ngIf="visible" mode="indeterminate"></mat-progress-spinner>',
                styles         : [
                    `
                        :host ::ng-deep {
                            .mat-progress-spinner svg > circle {
                                stroke-width: 5% !important;
                            }
                        }
                    `
                ],
                imports        : [
                    MatProgressSpinnerModule,
                    NgIf
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class LoadingSpinnerComponent {
    @Input()
    visible!: boolean;
}
