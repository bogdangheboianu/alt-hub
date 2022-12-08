import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive( { selector: '[appButton]' } )
export class ButtonDirective {
    @Input()
    disabled: boolean = false;

    @Input()
    fullWidth: boolean = false;

    @Output()
    onClick: EventEmitter<void> = new EventEmitter<void>();
}
