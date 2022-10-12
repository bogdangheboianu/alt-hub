import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth/guards/auth.guard';
import { NotAuthGuard } from '@auth/guards/not-auth.guard';
import { PublicLayoutComponent } from '@layout/public-layout/public-layout.component';
import { SecureLayoutComponent } from '@layout/secure-layout/secure-layout.component';
import { PUBLIC_ROUTES } from '@layout/routes/public.routes';
import { SECURE_ROUTES } from '@layout/routes/secure.routes';

const routes: Routes = [
    {
        path       : '',
        component  : PublicLayoutComponent,
        children   : PUBLIC_ROUTES,
        canActivate: [ NotAuthGuard ]
    },
    {
        path       : '',
        component  : SecureLayoutComponent,
        children   : SECURE_ROUTES,
        canActivate: [ AuthGuard ]
    }
];

@NgModule( {
               imports: [ RouterModule.forRoot( routes ) ],
               exports: [ RouterModule ]
           } )
export class AppRoutingModule {
}
