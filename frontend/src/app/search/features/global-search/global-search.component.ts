import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GlobalSearchInputComponent } from '@search/ui/global-search-input.component';

@Component( {
                standalone     : true,
                selector       : 'app-global-search',
                template       : `
                    <div style="width: 500px">
                        <app-global-search-input></app-global-search-input>
                    </div>
                `,
                imports        : [
                    GlobalSearchInputComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class GlobalSearchComponent {
}
