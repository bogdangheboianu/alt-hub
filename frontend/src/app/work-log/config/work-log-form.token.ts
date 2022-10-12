import { InjectionToken } from '@angular/core';
import { IForm } from '@shared/interfaces/form.interface';

export const WORK_LOG_FORM = new InjectionToken<IForm<any>>( 'WorkLogForm' );
