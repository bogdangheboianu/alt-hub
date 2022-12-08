import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component( {
                standalone     : true,
                selector       : 'app-section-title',
                template       : `
                    <h3 class="mat-subheader m-0 p-0 fw-bold" [class.mb-3]="withMarginBottom" style="color: rgb(91, 91, 91)">
                        <mat-icon color="primary">{{ icon }}</mat-icon>
                        <span style="padding-left: 6px !important;">{{ title }}</span>
                    </h3>
                `,
                imports        : [
                    MatIconModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class SectionTitleComponent {
    @Input()
    title!: string;

    @Input()
    icon!: string;

    @Input()
    withMarginBottom = true;
}
