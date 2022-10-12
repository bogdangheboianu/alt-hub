import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

/* TODO: worth it? */
@Injectable()
export class ModalService {
    constructor(private dialog: MatDialog) {
    }
}
