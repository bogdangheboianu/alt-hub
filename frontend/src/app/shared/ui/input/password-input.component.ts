import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Host, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { InputViewComponent } from '@shared/ui/input/input-view.component';
import { InputDirective } from '@shared/ui/input/input.directive';
import { InputModule } from '@shared/ui/input/input.module';

@Component( {
                standalone     : true,
                selector       : 'app-password-input',
                template       : `
                    <mat-form-field appearance="outline">
                        <mat-label>{{ input.label }}</mat-label>
                        <input matInput
                               [type]="hide ? 'password' : 'text'"
                               [(ngModel)]="input.value"
                               [disabled]="input.disabled"
                               [required]="input.required"
                               [class.disabled]="input.disabled"
                               [errorStateMatcher]="input.errorStateMatcher"
                               (input)="input.onChange($any($event.target).value)"
                               (blur)="input.onTouch()">
                        <button mat-icon-button
                                matSuffix
                                (click)="hide = !hide"
                                [attr.aria-label]="'Hide password'"
                                [attr.aria-pressed]="hide">
                            <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
                        </button>
                        <mat-hint *ngIf="input.hint">{{ input.hint }}</mat-hint>
                        <mat-error>
                            <ul class="error-list">
                                <li *ngFor="let err of input.errors">{{ err }}</li>
                            </ul>
                        </mat-error>
                    </mat-form-field>
                    <ng-template #inputView>
                        <app-input-view [value]="input.value"
                                        [label]="input.label" (onClick)="input.inputViewClicked()"></app-input-view>
                    </ng-template>
                `,
                imports        : [
                    CommonModule,
                    MatFormFieldModule,
                    MatInputModule,
                    FormsModule,
                    InputModule,
                    InputViewComponent,
                    MatButtonModule,
                    MatIconModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class PasswordInputComponent implements AfterViewInit {
    @ViewChild( MatInput )
    matInput!: MatInput;

    hide = true;

    constructor(@Host() public readonly input: InputDirective<string>) {
    }

    ngAfterViewInit(): void {
        this.input.inputElement = this.matInput;
    }
}
