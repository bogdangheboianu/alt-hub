import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component( {
                standalone     : true,
                selector       : 'app-loading-bar',
                template       : ' <mat-progress-bar *ngIf="visible" mode="indeterminate"></mat-progress-bar>',
                imports        : [
                    MatProgressBarModule,
                    NgIf
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class LoadingBarComponent {
    @Input()
    visible!: boolean;
}
