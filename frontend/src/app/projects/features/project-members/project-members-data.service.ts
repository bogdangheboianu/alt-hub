import { Injectable } from '@angular/core';
import { AuthSelectors } from '@auth/data/auth.selectors';
import { CompanyActions } from '@company/data/company.actions';
import { CompanySelectors } from '@company/data/company.selectors';
import { CreateProjectMemberDto } from '@dtos/create-project-member-dto';
import { ProjectDto } from '@dtos/project-dto';
import { UpdateProjectMemberDto } from '@dtos/update-project-member-dto';
import { UserStatusEnum } from '@dtos/user-status-enum';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { arrayMinusArray } from '@shared/config/functions/array.functions';
import { takeIfTrue, takeOnce } from '@shared/config/functions/custom-rxjs.operators';
import { valueIsNotEmpty } from '@shared/config/functions/value.functions';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';
import { SelectInputOptions } from '@shared/ui/input/select-input.component';
import { usersToSelectInputOptions } from '@users/config/user.functions';
import { UserActions } from '@users/data/user.actions';
import { UserSelectors } from '@users/data/user.selectors';
import { combineLatest, filter, map, Observable } from 'rxjs';

interface ProjectMembersComponentData {
    usersSelectInputOptions: SelectInputOptions;
    usersSelectInputOptionsLoading: boolean;
    pricingProfilesSelectInputOptions: SelectInputOptions;
    pricingProfilesSelectInputOptionsLoading: boolean;
}

@Injectable()
export class ProjectMembersDataService extends DetailsComponentDataService<ProjectDto, ProjectMembersComponentData> {
    constructor(
        private readonly projectActions: ProjectActions,
        private readonly projectSelectors: ProjectSelectors,
        private readonly userActions: UserActions,
        private readonly userSelectors: UserSelectors,
        private readonly authSelectors: AuthSelectors,
        private readonly companyActions: CompanyActions,
        private readonly companySelectors: CompanySelectors
    ) {
        super( projectSelectors );
    }

    createProjectMember(data: CreateProjectMemberDto): void {
        this.entity.then( project => this.projectActions.createProjectMember( project.id, data ) );
    }

    updateProjectMember(memberId: string, data: UpdateProjectMemberDto): void {
        this.entity.then( project => this.projectActions.updateProjectMember( project.id, memberId, data ) );
    }

    deleteProjectMember(memberId: string): void {
        this.entity.then( project => this.projectActions.deleteProjectMember( project.id, memberId ) );
    }

    isLoggedUserAdmin(): Observable<boolean> {
        return this.authSelectors.isLoggedUserAdmin()
                   .pipe( takeOnce );
    }

    protected override onInit(): void {
        this.loadUsers();
        this.loadCompany();
    }

    protected override dataSource(): ComponentDataSource<ProjectMembersComponentData> {
        return {
            usersSelectInputOptions                 : this.getUsersSelectInputOptions(),
            usersSelectInputOptionsLoading          : this.userSelectors.selectLoading(),
            pricingProfilesSelectInputOptions       : this.companySelectors.selectCompanyPricingProfilesAsSelectInputOptions(),
            pricingProfilesSelectInputOptionsLoading: this.companySelectors.selectLoading()
        };
    }

    private loadUsers(): void {
        this.authSelectors.isLoggedUserAdmin()
            .pipe( takeOnce, takeIfTrue )
            .subscribe( () => this.userActions.loadAllUsers( {
                                                                 statuses: Object.values( UserStatusEnum )
                                                                                 .filter( status => status !== UserStatusEnum.Inactive )
                                                             } ) );
    }

    private loadCompany(): void {
        this.authSelectors.isLoggedUserAdmin()
            .pipe( takeOnce, takeIfTrue )
            .subscribe( () => this.companyActions.loadCompany() );
    }

    private getUsersSelectInputOptions(): Observable<SelectInputOptions> {
        return combineLatest( [ this.entity$, this.userSelectors.selectAll() ] )
            .pipe(
                filter( ([ project, _ ]) => valueIsNotEmpty( project ) ),
                map( ([ project, users ]) => arrayMinusArray( users, project!.members.map( m => m.user ), 'id' ) ),
                map( usersToSelectInputOptions )
            );
    }
}
