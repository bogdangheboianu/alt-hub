import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContainerComponent } from '@shared/ui/container.component';

export interface QuickActionCard {
    title: string;
    icon: string;
    visible: boolean;
    command: () => any | Promise<any>;
}

export type QuickActionCards = QuickActionCard[];

@Component( {
                standalone     : true,
                selector       : 'app-quick-action-card',
                template       : `
                    <app-container *ngIf="data.visible"
                                   [clickable]="true"
                                   (onClick)="data.command()">
                        <div class="flex flex-column align-items-center justify-content-center w-100 h-100">
                            <div class="row">
                                <div class="col-4 p-0"></div>
                                <div class="col-4 p-0">
                                    <mat-icon class="icon" color="primary">{{ data.icon }}</mat-icon>
                                </div>
                                <div class="col-4 p-0"></div>
                            </div>
                            <h4 class="fw-bold fs-5 m-0 text-center">{{ data.title }}</h4>
                        </div>
                    </app-container>
                `,
                styles         : [
                    `.icon {
                        width: 65px;
                        height: 65px;
                        font-size: 65px;
                    }`
                ],
                imports        : [
                    ContainerComponent,
                    NgIf,
                    MatIconModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class QuickActionCardComponent {
    @Input()
    data!: QuickActionCard;
}
