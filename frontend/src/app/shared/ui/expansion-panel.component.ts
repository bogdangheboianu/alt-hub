import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { ContainerComponent } from '@shared/ui/container.component';
import { SectionTitleComponent } from '@shared/ui/section-title.component';

@Component( {
                standalone     : true,
                selector       : 'app-expansion-panel',
                template       : `
                    <article class="mb-3">
                        <app-container [noBackground]="noBackground">
                            <mat-accordion>
                                <mat-expansion-panel [expanded]="expanded"
                                                     (opened)="opened.emit()"
                                                     (closed)="closed.emit()">
                                    <mat-expansion-panel-header>
                                        <mat-panel-title>
                                            <app-section-title [title]="title" [icon]="icon" [withMarginBottom]="false"></app-section-title>
                                        </mat-panel-title>
                                    </mat-expansion-panel-header>
                                    <ng-content></ng-content>
                                </mat-expansion-panel>
                            </mat-accordion>
                        </app-container>
                    </article>

                `,
                styles         : [
                    `.mat-expansion-panel:not([class*=mat-elevation-z]) {
                        box-shadow: none;
                    }

                    .mat-accordion .mat-expansion-panel:last-of-type {
                        border: none
                    }

                    .mat-expansion-panel-header {
                        padding: 0 5px;
                        height: auto;
                        margin-right: 6px;
                    }

                    .mat-expansion-panel .mat-expansion-panel-header.cdk-keyboard-focused:not([aria-disabled=true]), .mat-expansion-panel .mat-expansion-panel-header.cdk-program-focused:not([aria-disabled=true]), .mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:hover:not([aria-disabled=true]) {
                        background: none;
                    }

                    :host ::ng-deep .mat-expansion-panel-body {
                        padding: 20px 0 0 0 !important;
                    }

                    :host ::ng-deep {
                        .mat-expansion-panel-header {
                            padding: 0 !important;
                        }
                    }
                    `
                ],
                imports        : [
                    MatExpansionModule,
                    SectionTitleComponent,
                    NgIf,
                    ContainerComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class ExpansionPanelComponent {
    @Input()
    title!: string;

    @Input()
    icon!: string;

    @Input()
    expanded = false;

    @Input()
    noBackground = false;

    @Output()
    opened = new EventEmitter();

    @Output()
    closed = new EventEmitter();

    @ViewChild( MatExpansionPanel )
    panel!: MatExpansionPanel;

    close(): void {
        this.panel.close();
    }
}
