import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Host, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { InputViewComponent } from '@shared/ui/input/input-view.component';
import { InputDirective } from '@shared/ui/input/input.directive';

@Component( {
                standalone     : true,
                selector       : 'app-textarea-input',
                template       : `
                    <mat-form-field appearance="outline" *ngIf="!input.showInputView; else inputView">
                        <mat-label>{{ input.label }}</mat-label>
                        <textarea matInput
                                  [(ngModel)]="input.value"
                                  [disabled]="input.disabled"
                                  [required]="input.required"
                                  [class.disabled]="input.disabled"
                                  [errorStateMatcher]="input.errorStateMatcher"
                                  (input)="input.onChange($any($event.target).value)"
                                  (blur)="input.onTouch()"></textarea>
                        <mat-hint *ngIf="input.hint">{{ input.hint }}</mat-hint>
                        <mat-error *ngIf="input.errors.length > 0">
                            <ul class="error-list">
                                <li *ngFor="let error of input.errors">{{ error }}</li>
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
                    InputViewComponent
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class TextareaInputComponent implements AfterViewInit {
    @ViewChild( MatInput )
    matInput!: MatInput;

    constructor(@Host() public readonly input: InputDirective<string>) {
    }

    ngAfterViewInit(): void {
        this.input.inputElement = this.matInput;
    }
}
