import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentInstance } from '@shared/config/constants/shared.types';
import { valueIsNotEmpty } from '@shared/config/functions/value.functions';
import { takeUntilDestroy } from 'ngx-reactivetoolkit';

type OpenModal<C> = { component: ComponentType<C>; dialogRef: MatDialogRef<C> }
type ModalConfig = Pick<MatDialogConfig, 'autoFocus'>

@Injectable()
export class ModalService {
    private openedModals: OpenModal<any>[];

    constructor(private readonly dialog: MatDialog) {
        this.openedModals = [];
    }

    openSmModal<D, C = any>(component: ComponentType<C>, fromComponent: ComponentInstance, data?: D, config?: ModalConfig): void {
        this.open( component, { data, width: '500px', ...config } )
            .beforeClosed()
            .pipe( takeUntilDestroy( fromComponent ) )
            .subscribe( () => this.removeFromOpenedModals( component ) );
    }

    openMdModal<D, C = any>(component: ComponentType<C>, fromComponent: ComponentInstance, data?: D, config?: ModalConfig): void {
        this.open( component, { data, width: '700px', ...config } )
            .beforeClosed()
            .pipe( takeUntilDestroy( fromComponent ) )
            .subscribe( () => this.removeFromOpenedModals( component ) );
    }

    close<C>(component: ComponentType<C>): void {
        const openedModal = this.findOpenedModal( component );
        openedModal?.dialogRef.close();
        this.removeFromOpenedModals( component );
    }

    private open<C, D>(component: ComponentType<C>, config?: MatDialogConfig<D>): MatDialogRef<C> {
        const openedModal = this.findOpenedModal( component );

        if( valueIsNotEmpty( openedModal ) ) {
            return openedModal.dialogRef;
        }

        const dialogRef = this.dialog.open<C, D>( component, config );
        this.openedModals.push( { component, dialogRef } );

        return dialogRef;
    }

    private findOpenedModal<C>(component: ComponentType<C>): OpenModal<C> | null {
        return this.openedModals.find( m => m.component === component ) ?? null;
    }

    private removeFromOpenedModals<C>(component: ComponentType<C>): void {
        this.openedModals = this.openedModals.filter( m => m.component !== component );
    }
}
