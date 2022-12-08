import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CreateProjectDto } from '@dtos/create-project-dto';
import { ProjectSuccessMessage } from '@projects/config/project.constants';
import { ProjectCreateDataService } from '@projects/features/project-create/project-create-data.service';
import { subscribeUntilTrue } from '@shared/config/functions/subscription.functions';
import { MessageService } from '@shared/features/message/message.service';
import { NavigationService } from '@shared/features/navigation/navigation.service';
import { UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector       : 'app-project-create',
                template       : `
                    <ng-container *ngIf="(dataService.data$ | async)! as data">
                        <app-header>
                            <app-title headerLeft title="Add new project"></app-title>
                        </app-header>
                        <app-container>
                            <app-project-create-form [loading]="data.loading"
                                                     [clientOptions]="data.clientOptions"
                                                     [clientOptionsLoading]="data.clientOptionsLoading"
                                                     (onSubmit)="createProject($event)"></app-project-create-form>
                        </app-container>
                    </ng-container>
                `,
                providers      : [ ProjectCreateDataService ],
                changeDetection: ChangeDetectionStrategy.OnPush
            } )
@UntilDestroy()
export class ProjectCreateComponent implements OnInit {
    constructor(
        public readonly dataService: ProjectCreateDataService,
        private readonly navigationService: NavigationService,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.dataService.init( this );
    }

    createProject(data: CreateProjectDto): void {
        this.dataService.create( data );
        this.onProjectCreateSuccess();
    }

    private onProjectCreateSuccess(): void {
        subscribeUntilTrue( this.dataService.source!.success, this, () => {
            this.navigationService.projectList();
            this.messageService.success( ProjectSuccessMessage.Created );
        } );
    }
}
