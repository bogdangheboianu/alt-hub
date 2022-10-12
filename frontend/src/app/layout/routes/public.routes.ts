import { Routes } from '@angular/router';
import { AppR } from '@shared/constants/routes';
import { UserConfirmPageComponent } from '@user/pages/user-confirm-page/user-confirm-page.component';

export const PUBLIC_ROUTES: Routes = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: AppR.auth.login.full
    },
    {
        path     : AppR.user.confirm.simple,
        component: UserConfirmPageComponent
    }
];
