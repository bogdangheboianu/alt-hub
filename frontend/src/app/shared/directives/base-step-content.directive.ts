import { Directive, EventEmitter, OnInit, Output } from '@angular/core';
import { NextButtonLabel } from '@shared/components/buttons/next-button/next-button.component';
import { IForm } from '@shared/interfaces/form.interface';
import { Observable } from 'rxjs';

@Directive()
export abstract class BaseStepContent<T> implements OnInit {
    @Output()
    onNextStep = new EventEmitter();

    @Output()
    onPreviousStep = new EventEmitter();

    submitData$!: Observable<T | null>;
    nextButtonLabel: NextButtonLabel = 'Next';

    abstract form?: IForm<T>;
    abstract nextStepDisabled: boolean;
    abstract previousStepDisabled: boolean;
    abstract isLastStep: boolean;

    protected constructor(private readonly _submitDataSelector: () => Observable<T | null>) {
    }

    ngOnInit(): void {
        this.submitData$ = this._submitDataSelector();

        if( this.isLastStep ) {
            this.nextButtonLabel = 'Save';
        }
    }

    nextStep(): void {
        this.onNextStep.emit();
    }

    previousStep(): void {
        this.onPreviousStep.emit();
    }
}
