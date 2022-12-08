import { NgClass, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { valueIsDefined } from '@shared/config/functions/value.functions';

export type AvatarSize = 'small' | 'medium' | 'large';
export type AvatarType = 'image' | 'text'

@Component( {
                standalone     : true,
                selector       : 'app-avatar',
                template       : `
                    <ng-container [ngSwitch]="type">
                        <div *ngSwitchCase="'text'"
                             class="avatar"
                             [class.large]="isLarge"
                             [class.medium]="isMedium"
                             [class.small]="isSmall">
                            <strong>{{ firstLetter }}</strong>
                        </div>
                        <img *ngSwitchCase="'image'"
                             class="avatar"
                             [alt]="imgAlt"
                             [class.large]="isLarge"
                             [class.medium]="isMedium"
                             [class.small]="isSmall"
                             [matTooltip]="tooltip"
                             [src]="imgSrc"
                             [ngClass]="{'highlight': highlight}">

                    </ng-container>
                `,
                styles         : [
                    `
                        .avatar {
                            border-radius: 50%;
                            text-align: center;
                            background: #3F51B5;
                            color: #f4f4f4;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            object-fit: cover;
                        }

                        .avatar.large {
                            width: 70px;
                            height: 70px;
                            font-size: 60px;
                        }

                        .avatar.medium {
                            width: 30px;
                            height: 30px;
                            font-size: 20px;
                        }

                        .avatar.small {
                            width: 10px;
                            height: 10px;
                            font-size: 5px;
                        }

                        .highlight {
                            border: solid 3px #4C2DFF;
                        }
                    `
                ],
                imports        : [
                    NgSwitch,
                    NgSwitchCase,
                    MatTooltipModule,
                    NgClass
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
export class AvatarComponent {
    @Input()
    set name(value: string | undefined) {
        this.firstLetter = valueIsDefined( value )
                           ? value[0].toUpperCase()
                           : '';
    }

    @Input()
    size: AvatarSize = 'medium';

    @Input()
    type: AvatarType = 'text';

    @Input()
    tooltip = '';

    @Input()
    imgAlt = '';

    @Input()
    imgSrc = '';

    @Input()
    highlight = false;

    firstLetter = '';

    get isLarge(): boolean {
        return this.size === 'large';
    }

    get isSmall(): boolean {
        return this.size === 'small';
    }

    get isMedium(): boolean {
        return this.size === 'medium';
    }
}
