import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { AppR } from '@shared/constants/routes';
import { MessageService } from '@shared/services/message.service';
import { ProjectDto } from '@dtos/project.dto';
import { WorkLogRecurrenceDto } from '@dtos/work-log-recurrence.dto';
import { takeIfTrue } from '@shared/custom-rxjs-operators';
import { BaseTable, TableColumns } from '@shared/directives/base-table.directive';
import { UpdateWorkLogRecurrenceFormComponent } from '@work-log/components/update-work-log-recurrence-form/update-work-log-recurrence-form.component';
import { WorkLogRecurrenceOperationMessage } from '@work-log/constants/work-log-recurrence-operation-message.enum';
import { WorkLogRecurrenceActions } from '@work-log/store/work-log-recurrence/work-log-recurrence.actions';
import { WorkLogRecurrenceSelectors } from '@work-log/store/work-log-recurrence/work-log-recurrence.selectors';
import { WorkLogRecurrenceState } from '@work-log/store/work-log-recurrence/work-log-recurrence.store';
import { takeUntilDestroy, UntilDestroy } from 'ngx-reactivetoolkit';

@Component( {
                selector   : 'app-work-log-recurrences-table',
                templateUrl: './work-log-recurrences-table.component.html',
                styleUrls  : [ './work-log-recurrences-table.component.scss' ]
            } )
@UntilDestroy()
export class WorkLogRecurrencesTableComponent extends BaseTable<WorkLogRecurrenceDto, WorkLogRecurrenceState> implements OnInit {
    @Input() showUser!: boolean;

    constructor(
        private readonly workLogRecurrenceSelectors: WorkLogRecurrenceSelectors,
        private readonly workLogRecurrenceActions: WorkLogRecurrenceActions,
        private readonly dialog: MatDialog,
        private readonly router: Router,
        private readonly messageService: MessageService
    ) {
        super( workLogRecurrenceSelectors );
    }

    override get columns(): TableColumns<WorkLogRecurrenceDto> {
        return [
            'status',
            'project',
            'minutesLogged',
            'weekDays',
            'createdAt',
            'actions'
        ];
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.onWorkLogRecurrenceStatusUpdateSuccess();
    }

    openUpdateWorkLogRecurrenceDialog(workLogRecurrence: WorkLogRecurrenceDto): void {
        this.dialog.open( UpdateWorkLogRecurrenceFormComponent,
                          {
                              width: '600px',
                              data : { workLogRecurrence }
                          } );
    }

    async goToProjectPage(project: ProjectDto): Promise<void> {
        await this.router.navigateByUrl( `${ AppR.project.list.full }/${ project.id }` );
    }

    toggleWorkLogRecurrenceStatus(event: MatSlideToggleChange, id: string): void {
        event.checked
        ? this.workLogRecurrenceActions.activateWorkLogRecurrence( id )
        : this.workLogRecurrenceActions.deactivateWorkLogRecurrence( id );
    }

    private onWorkLogRecurrenceStatusUpdateSuccess(): void {
        this.workLogRecurrenceSelectors.selectSuccess()
            .pipe( takeUntilDestroy( this ), takeIfTrue )
            .subscribe( () => this.messageService.success( WorkLogRecurrenceOperationMessage.StatusUpdated ) );
    }
}
