import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContainerComponent } from '@shared/ui/container.component';

@Component( {
                standalone     : true,
                selector       : 'app-header',
                template       : `
                    <div class="mb-3">
                        <app-container [height]="height" [loading]="loading">
                            <div class="d-flex align-items-center justify-content-between w-100">
                                <section style="width: 70%" class="d-flex align-items-center justify-content-start">
                                    <ng-content select="[headerLeft]"></ng-content>
                                </section>
                                <section style="width: 30%" class="d-flex align-items-center justify-content-end">
                                    <ng-content select="[headerRight]"></ng-content>
                                </section>
                            </div>
                            <section>
                                <ng-content select="[headerBottom]"></ng-content>
                            </section>
                        </app-container>
                    </div>`,
                imports        : [
                    ContainerComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class HeaderComponent {
    @Input()
    loading = false;

    @Input()
    height?: string;
}
