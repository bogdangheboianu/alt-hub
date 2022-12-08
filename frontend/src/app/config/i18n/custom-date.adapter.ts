import { Platform } from '@angular/cdk/platform';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { Inject, Injectable, LOCALE_ID, PLATFORM_ID } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
    constructor(
        @Inject( LOCALE_ID ) public override locale: string,
        @Inject( PLATFORM_ID ) private platformId: Platform
    ) {
        super( locale, platformId );
    }

    override getFirstDayOfWeek(): number {
        return getLocaleFirstDayOfWeek( this.locale );
    }
}
