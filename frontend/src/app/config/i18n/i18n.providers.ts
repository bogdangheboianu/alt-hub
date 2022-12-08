import { LOCALE_ID, Provider } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '@config/i18n/custom-date.adapter';

export const i18nProviders: Provider[] = [
    {
        provide : LOCALE_ID,
        useValue: 'ro'
    },
    {
        provide : MAT_DATE_LOCALE,
        useValue: 'ro'
    },
    {
        provide : DateAdapter,
        useClass: CustomDateAdapter
    }
]
