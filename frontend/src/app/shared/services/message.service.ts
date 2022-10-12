import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponseDto } from '@dtos/http-error-response.dto';
import { ErrorMessageComponent } from '@shared/components/messages/error-message/error-message.component';
import { SuccessMessageComponent } from '@shared/components/messages/success-message/success-message.component';

@Injectable()
export class MessageService {
    constructor(private readonly snackBar: MatSnackBar) {
    }

    success(message: string): void {
        this.showMessage( SuccessMessageComponent, message, 'success' );
    }

    error(error: HttpErrorResponseDto): void {
        this.showMessage( ErrorMessageComponent, error, 'error' );
    }

    private showMessage(component: ComponentType<any>, data: string | HttpErrorResponseDto, type: 'success' | 'error'): void {
        this.snackBar.openFromComponent( component, {
                                             data,
                                             politeness        : 'off',
                                             duration          : 3000,
                                             panelClass        : type,
                                             horizontalPosition: 'left'
                                         }
        );
    }
}
