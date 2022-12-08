import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@config/guards/auth.guard';
import { NotAuthGuard } from '@config/guards/not-auth.guard';

const routes: Routes = [
    {
        path        : '',
        loadChildren: () => import('@layouts/public/public.module').then( m => m.PublicModule ),
        canActivate : [ NotAuthGuard ]
    },
    {
        path        : '',
        loadChildren: () => import('@layouts/secure/secure.module').then( m => m.SecureModule ),
        canActivate : [ AuthGuard ]
    },
    {
        path        : '**',
        loadChildren: () => import('@not-found/not-found.module').then( m => m.NotFoundModule ),
        pathMatch   : 'full'
    }
];

@NgModule( {
               imports: [ RouterModule.forRoot( routes ) ],
               exports: [ RouterModule ]
           } )
export class AppRoutingModule {
}
