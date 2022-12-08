import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component( {
                standalone     : true,
                selector       : 'app-global-search-input',
                template       : `
                    <mat-form-field appearance="standard" style="width: 100%">
                        <mat-icon matPrefix>search</mat-icon>
                        <input matInput type="text" placeholder="Search everything...">
                    </mat-form-field>

                `,
                styles         : [
                    `
                        :host ::ng-deep {
                            .mat-form-field {
                                font-size: 15px;
                                margin: 0;
                                line-height: unset;
                            }

                            .mat-form-field-underline, .mat-form-field-underline:hover {
                                display: none;
                            }

                            .mat-form-field-wrapper {
                                padding: 0;
                                margin: 0;
                            }

                            .mat-form-field-infix {
                                top: 0;
                                padding-bottom: 1rem;
                                border-top: none;
                            }

                            .mat-form-field-appearance-standard .mat-form-field-prefix, .mat-form-field-appearance-standard .mat-form-field-suffix {
                                top: 0.4em
                            }
                        }

                    `
                ],
                imports        : [
                    MatFormFieldModule,
                    MatIconModule,
                    MatInputModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class GlobalSearchInputComponent {

}
