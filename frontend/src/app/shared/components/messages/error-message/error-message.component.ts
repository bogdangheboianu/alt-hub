import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { HttpErrorResponseDto } from '@dtos/http-error-response.dto';

@Component( {
                selector   : 'app-error-message',
                templateUrl: './error-message.component.html',
                styleUrls  : [ './error-message.component.scss' ]
            } )
export class ErrorMessageComponent {
    constructor(
        @Inject( MAT_SNACK_BAR_DATA ) public error: HttpErrorResponseDto
    ) {
    }
}
