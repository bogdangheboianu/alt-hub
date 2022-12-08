import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

export interface DropdownMenuItem {
    text: string;
    icon?: string;
    color: DropdownMenuItemColor;
    command: () => Promise<void> | void;
}

export type DropdownMenuItemColor = 'default' | 'warn';
export type DropdownMenuItems = DropdownMenuItem[];

@Component( {
                standalone     : true,
                selector       : 'app-dropdown-menu',
                template       : `
                    <div *ngIf="menuItems">
                        <button mat-icon-button
                                [matMenuTriggerFor]="menu">
                            <mat-icon>{{ icon }}</mat-icon>
                        </button>
                        <mat-menu #menu="matMenu">
                            <button *ngFor="let item of menuItems"
                                    mat-menu-item
                                    class="dropdown-menu-item-btn"
                                    [class.warn]="item.color === 'warn'"
                                    (click)="item.command()">
                                <mat-icon *ngIf="item.icon as icon"
                                          class="three-dot-menu-item-icon"
                                          style="font-size: 20px"
                                          [class.warn]="item.color === 'warn'">{{ icon }}</mat-icon>
                                <span>{{ item.text }}</span>
                            </button>
                        </mat-menu>
                    </div>

                `,
                styles         : [
                    `.dropdown-menu-item-btn, .three-dot-menu-item-icon {
                        color: #5b5b5b;
                    }

                    .dropdown-menu-item-btn.warn, .three-dot-menu-item-icon.warn {
                        color: #f44336
                    }`
                ],
                imports        : [
                    CommonModule,
                    MatButtonModule,
                    MatMenuModule,
                    MatIconModule
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class DropdownMenuComponent {
    @Input()
    menuItems!: DropdownMenuItems;

    @Input()
    icon: string = 'more_vert';
}
