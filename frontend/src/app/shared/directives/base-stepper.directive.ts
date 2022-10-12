import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Directive, inject, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { takeIfTrue } from '@shared/custom-rxjs-operators';
import { SuccessfulSubmissionMessage } from '@shared/directives/base-form.directive';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsString } from '@shared/functions/value-is-string.function';
import { IStepData } from '@shared/interfaces/step-data.interface';
import { MessageService } from '@shared/services/message.service';
import { BaseEntitySelector } from '@shared/store/base-entity-selector';
import { Steps } from '@shared/types/steps.type';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';
import { firstValueFrom, map, Observable, zip } from 'rxjs';

@Directive()
@UntilDestroy()
export abstract class BaseStepper<SubmitData, StepKey extends string> implements OnInit, AfterViewInit {
    @ViewChild( 'stepper' )
    stepper!: MatStepper;

    steps!: Steps<StepKey>;
    loading$!: Observable<boolean>;

    get submitData$(): Observable<SubmitData | null> {
        return this._submitDataSelector();
    }

    get submitButtonDisabled$(): Observable<boolean> {
        return zip( this.loading$, this.submitData$ )
            .pipe(
                map( ([ loading, submitData ]) => loading || valueIsEmpty( submitData ) )
            );
    }

    private readonly _messageService: MessageService = inject( MessageService );

    protected constructor(
        private readonly _entitySelector: BaseEntitySelector<any, any>,
        private readonly _submitDataSelector: () => Observable<SubmitData | null>) {
    }

    ngOnInit(): void {
        this.loading$ = this._entitySelector.selectLoading();
        this.handleSuccessfulSubmission();
    }

    ngAfterViewInit(): void {
        this.validateStepperComponent();
        this.steps = this.getSteps();
    }

    async submit(): Promise<void> {
        const data = await firstValueFrom( this.submitData$ );

        if( valueIsEmpty( data ) ) {
            return;
        }

        this.onSubmit( data );
    }

    previousStep(): void {
        this.stepper.previous();
    }

    nextStep(): void {
        this.stepper.selected!.completed = true;
        this.stepper.next();
    }

    onStepChanged(event: StepperSelectionEvent): void {
        const previouslyStep = Object.values( this.steps )
                                     .find( step => (
                                         step as IStepData<any>
                                     ).component.label === event.previouslySelectedStep.label )! as IStepData<any>;
        previouslyStep.content.form?.submit();
    }

    stepLabel(stepKey: StepKey): string {
        return valueIsEmpty( this.steps )
               ? ''
               : this.steps[stepKey].label;
    }

    stepHasError(stepKey: StepKey): boolean {
        return valueIsEmpty( this.steps ) || valueIsEmpty( this.steps[stepKey].content.form )
               ? false
               : this.steps[stepKey].content.form!.form.invalid && this.steps[stepKey].content.form!.form.touched;
    }

    stepErrorMessage(stepKey: StepKey): string {
        return valueIsEmpty( this.steps )
               ? ''
               : this.steps[stepKey].errorMessage ?? 'Missing info';
    }

    stepIsEditable(stepKey: StepKey): boolean {
        return valueIsEmpty( this.steps )
               ? false
               : this.steps[stepKey].editable;
    }

    stepIsOptional(stepKey: StepKey): boolean {
        return valueIsEmpty( this.steps )
               ? false
               : this.steps[stepKey].optional ?? false;
    }

    protected abstract getSteps(): Steps<StepKey>;

    protected abstract onSubmit(data: SubmitData): void;

    protected abstract onSuccessfulSubmission(): SuccessfulSubmissionMessage | void;

    private validateStepperComponent(): void {
        if( valueIsEmpty( this.stepper ) ) {
            throw new Error( 'All steppers must contain in their template a MatStepper component with id #stepper' );
        }

        if( !this.stepper.linear ) {
            throw new Error( 'All steppers must have the \'linear\' attribute set' );
        }
    }

    private handleSuccessfulSubmission(): void {
        this._entitySelector.selectSuccess()
            .pipe( takeUntilDestroy( this ), takeIfTrue )
            .subscribe( () => {
                this.resetStepperAndForms();
                this.executeCustomSuccessLogic();
            } );
    }

    private resetStepperAndForms(): void {
        this.stepper.reset();
        Object.values( this.steps )
              .forEach( step => (
                  step as IStepData<any>
              ).content.form?.form.reset() );
    }

    private executeCustomSuccessLogic(): void {
        const successMessage = this.onSuccessfulSubmission();

        if( valueIsString( successMessage ) ) {
            this._messageService.success( successMessage );
        }
    }
}
