import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppR } from '@shared/config/constants/routes';

@Injectable( { providedIn: 'root' } )
export class NavigationService {
    constructor(private readonly router: Router) {
    }

    async navigateTo(url: string): Promise<void> {
        await this.router.navigateByUrl( url );
    }

    root(): void {
        this.navigateTo( AppR.root )
            .then();
    }

    login(): void {
        this.navigateTo( AppR.auth.login.full )
            .then();
    }

    dashboard(): void {
        this.navigateTo( AppR.dashboard.full )
            .then();
    }

    projectList(): void {
        this.navigateTo( AppR.project.list.full )
            .then();
    }

    clientList(): void {
        this.navigateTo( AppR.client.list.full )
            .then();
    }

    userList(): void {
        this.navigateTo( AppR.user.list.full )
            .then();
    }

    clientDetails(clientId: string): void {
        this.navigateTo( `${ AppR.client.list.full }/${ clientId }` )
            .then();
    }

    projectDetails(projectId: string): void {
        this.navigateTo( `${ AppR.project.list.full }/${ projectId }` )
            .then();
    }

    userDetails(userId: string): void {
        this.navigateTo( `${ AppR.user.list.full }/${ userId }` )
            .then();
    }

    clientCreate(): void {
        this.navigateTo( AppR.client.create.full )
            .then();
    }

    userCreate(): void {
        this.navigateTo( AppR.user.create.full )
            .then();
    }

    projectCreate(): void {
        this.navigateTo( AppR.project.create.full )
            .then();
    }
}
