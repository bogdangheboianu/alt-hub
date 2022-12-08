import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component( {
                standalone     : true,
                selector       : 'app-title',
                template       : `
                    <div class="d-flex align-items-center justify-content-start">
                        <div *ngIf="!icon">
                            <ng-content select="[titleLeft]"></ng-content>
                        </div>
                        <mat-icon *ngIf="icon" color="primary">{{ icon }}</mat-icon>
                        <div class="d-flex align-items-start justify-content-center flex-column mx-2">
                            <div class="d-flex align-items-center justify-content-start">
                                <h1 class="mat-headline p-0 m-0 mr-2" style="margin-right: 10px !important;">{{ title }}</h1>
                                <div>
                                    <ng-content select="[titleRight]"></ng-content>
                                </div>
                            </div>
                            <h2 *ngIf="subtitle" class="mat-subheading-1 p-0 m-0" style="color: #5b5b5b">{{ subtitle }}</h2>
                            <ng-content select="[customSubtitle]"></ng-content>
                        </div>
                    </div>
                `,
                imports        : [
                    CommonModule,
                    MatIconModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class TitleComponent {
    @Input()
    title!: string;

    @Input()
    subtitle?: string;

    @Input()
    icon?: string;
}
