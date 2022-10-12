import { AfterViewInit, Directive, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AuthSelectors } from '@auth/store/auth.selectors';
import { isDefined } from '@datorama/akita';
import { ErrorDto } from '@dtos/error.dto';
import { takeIfTrue, takeOnce } from '@shared/custom-rxjs-operators';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IForm } from '@shared/interfaces/form.interface';
import { MessageService } from '@shared/services/message.service';
import { BaseEntitySelector } from '@shared/store/base-entity-selector';
import { BaseSelector } from '@shared/store/base-selector';
import { FormGroupTyped } from '@shared/types/form.types';
import { filter, Observable, Subscription } from 'rxjs';

export type SuccessfulSubmissionMessage = string;

@Directive()
export abstract class BaseForm<T, I = T> implements IForm<T>, OnInit, OnDestroy, AfterViewInit, OnChanges {
    abstract form: FormGroupTyped<T>;
    loading$: Observable<boolean>;
    viewModeActive = false;

    @Input()
    initialValues?: I | null;

    @Output()
    successfulSubmission = new EventEmitter();

    private readonly _subscriptions = new Subscription();
    private _initialFormValues!: T;
    private readonly _storeSelector: BaseSelector<any> | BaseEntitySelector<any, any>;
    private readonly _messageService: MessageService = inject( MessageService );
    private readonly _authSelectors = inject( AuthSelectors );

    protected constructor(
        storeSelector: BaseSelector<any> | BaseEntitySelector<any, any>
    ) {
        this._storeSelector = storeSelector;
        this.loading$ = this._storeSelector.selectLoading();
    }

    submit(): void | boolean {
        if( !isDefined( this.form ) ) {
            return;
        }

        if( this.form?.invalid ) {
            this.form.markAllAsTouched();
            return;
        }

        this.onSubmit();

        return true;
    }

    ngOnInit(): void {
        this._subscriptions.add( this.subscribeForSuccessfulSubmission() );
        this._subscriptions.add( this.subscribeForSubmissionErrors() );
    }

    ngAfterViewInit(): void {
        this._initialFormValues = this.form?.getRawValue() as T;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if( valueIsNotEmpty( this.initialValues ) && changes['initialValues']?.previousValue !== changes['initialValues']?.currentValue ) {
            this.initialValues = changes['initialValues'].currentValue;
            this.form = this.buildForm();
        }
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }

    reset(): void {
        this.form.patchValue( { ...this._initialFormValues } );
        this.form.markAsUntouched();
    }

    activateViewMode(): void {
        this.viewModeActive = true;
    }

    async deactivateViewMode(onlyIfAdmin = false): Promise<void> {
        this._authSelectors.isLoggedUserAdmin()
            .pipe( takeOnce )
            .subscribe( isAdmin => {
                if( onlyIfAdmin && !isAdmin ) {
                    return;
                }

                this.viewModeActive = false;
            } );
    }

    protected abstract buildForm(): FormGroupTyped<T>;

    protected abstract onSubmit(): void | Promise<void>;

    protected onSuccessfulSubmission(): SuccessfulSubmissionMessage | Promise<SuccessfulSubmissionMessage> | void | Promise<void> {
        return;
    }

    private subscribeForSuccessfulSubmission(): Subscription {
        return this._storeSelector
                   .selectSuccess()
                   .pipe( takeIfTrue )
                   .subscribe( async () => {
                       if( isDefined( this.form ) ) {
                           const successMessage = await this.onSuccessfulSubmission();

                           if( typeof successMessage === 'string' ) {
                               this._messageService.success( successMessage );
                           }

                           this.successfulSubmission.emit();
                       }
                   } );
    }

    private subscribeForSubmissionErrors(): Subscription {
        return this._storeSelector
                   .selectError()
                   .pipe( filter( errors => valueIsNotEmpty( errors ) ) )
                   .subscribe( async (errors: ErrorDto[]) => {
                       if( isDefined( this.form ) ) {
                           const formFields = Object.keys( this.form.getRawValue() );
                           errors.forEach( err => {
                               if( err.field && formFields.includes( err.field ) && this.form.get( err.field ) ) {
                                   this.form.get( err.field )!.markAsTouched();
                                   this.form.get( err.field )!.setErrors( { [err.name]: err.message } );
                               }
                           } );
                       }
                   } );
    }
}
