import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NextButtonLabel } from '@shared/components/buttons/next-button/next-button.component';

@Component( {
                selector   : 'app-stepper-buttons',
                templateUrl: './stepper-buttons.component.html',
                styleUrls  : [ './stepper-buttons.component.scss' ]
            } )
export class StepperButtonsComponent {
    @Input()
    previousButtonDisabled = true;

    @Input()
    nextButtonDisabled = false;

    @Input()
    nextButtonLabel: NextButtonLabel = 'Next';

    @Output()
    onPreviousButtonClick = new EventEmitter();

    @Output()
    onNextButtonClick = new EventEmitter();

    previousButtonClicked(): void {
        this.onPreviousButtonClick.emit();
    }

    nextButtonClicked(): void {
        this.onNextButtonClick.emit();
    }
}
