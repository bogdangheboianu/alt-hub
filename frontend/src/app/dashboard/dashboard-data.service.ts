import { Injectable } from '@angular/core';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { UserDto } from '@dtos/user-dto';
import { takeIfDefined } from '@shared/config/functions/custom-rxjs.operators';
import { BaseComponentDataService, ComponentDataSource } from '@shared/data/base-component-data.service';
import { WorkLogStore } from '@work-logs/data/work-log.store';

interface DashboardComponentData {
    loggedUser: UserDto;
}

@Injectable()
export class DashboardDataService extends BaseComponentDataService<DashboardComponentData> {
    constructor(
        private readonly authSelectors: AuthSelectors,
        private readonly workLogStore: WorkLogStore
    ) {
        super( authSelectors );
    }

    override onInit(): void {
    }

    openWorkLogCreateFormModal(): void {
        this.workLogStore.setOpenWorkLogCreateFormModal( true );
    }

    protected override dataSource(): ComponentDataSource<DashboardComponentData> {
        return {
            loggedUser: this.authSelectors.selectLoggedUser()
                            .pipe( takeIfDefined )
        };
    }
}
