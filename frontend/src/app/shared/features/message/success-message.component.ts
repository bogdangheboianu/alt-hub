import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component( {
                selector       : 'app-success-message',
                template       : `
                    <div class="d-flex flex-column align-items-start justify-content-center">
                        <strong>Success</strong>
                        <p style="padding: 0; margin: 0">{{ message }}</p>
                    </div>

                `,
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class SuccessMessageComponent {
    constructor(@Inject( MAT_SNACK_BAR_DATA ) public readonly message: string) {
    }
}
