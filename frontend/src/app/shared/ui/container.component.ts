import { NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingSpinnerComponent } from '@shared/ui/loading-spinner.component';

@Component( {
                standalone     : true,
                selector       : 'app-container',
                template       : `
                    <div class="rounded-3 w-100 d-flex flex-column align-items-start justify-content-center"
                         [style]="'height: ' + (height ?? 'initial')"
                         [class.clickable]="clickable"
                         [class.shadow]="!noBackground"
                         [class.p-3]="!noBackground"
                         [class.app-container]="!noBackground"
                         (click)="cardClicked()">
                        <div class="w-100">
                            <ng-container *ngIf="!loading; else loadingSpinner">
                                <div class="d-flex align-items-center justify-content-between w-100">
                                    <ng-content select="[containerHeaderLeft]"></ng-content>
                                    <ng-content select="[containerHeaderRight]"></ng-content>
                                </div>
                                <ng-content></ng-content>
                            </ng-container>
                            <ng-template #loadingSpinner>
                                <div class="d-flex justify-content-center w-100">
                                    <app-loading-spinner [visible]="loading"></app-loading-spinner>
                                </div>
                            </ng-template>
                        </div>
                    </div>
                `,
                styles         : [
                    `.app-container {
                        background: #ffffff;
                    }

                    .app-container.clickable {
                        cursor: pointer;
                        transition: transform .2s ease;
                    }

                    .app-container.clickable:hover {
                        transform: scale(1.05);
                    }
                    `
                ],
                imports        : [
                    NgIf,
                    LoadingSpinnerComponent,
                    NgTemplateOutlet
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class ContainerComponent {
    @Input()
    clickable = false;

    @Input()
    loading = false;

    @Input()
    height?: string;

    @Input()
    noBackground = false;

    @Output() onClick = new EventEmitter();

    cardClicked(): void {
        if( this.clickable ) {
            this.onClick.emit();
        }
    }
}
