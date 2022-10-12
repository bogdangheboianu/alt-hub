import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { AuthenticatedContext } from '@shared/models/context/authenticated-context';
import { InternalContext } from '@shared/models/context/internal-context';
import { Result } from '@shared/models/generics/result';
import { ValidationChain } from '@shared/models/validation/validation-chain';
import { ActivateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/activate-work-log-recurrence.command';
import { CreateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/create-work-log-recurrence.command';
import { DeactivateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/deactivate-work-log-recurrence.command';
import { HandleRecurrentWorkLogsCommand } from '@work-logs/commands/impl/handle-recurrent-work-logs.command';
import { UpdateWorkLogRecurrenceCommand } from '@work-logs/commands/impl/update-work-log-recurrence.command';
import { CreateWorkLogRecurrenceDto } from '@work-logs/dtos/create-work-log-recurrence.dto';
import { UpdateWorkLogRecurrenceDto } from '@work-logs/dtos/update-work-log-recurrence.dto';
import { WorkLogRecurrenceDto } from '@work-logs/dtos/work-log-recurrence.dto';
import { WeekDayEnum } from '@work-logs/enums/week-day.enum';
import { modelsToWorkLogRecurrenceDtoList, modelToWorkLogRecurrenceDto } from '@work-logs/mappers/work-log-recurrence.mappers';
import { WorkLog } from '@work-logs/models/work-log';
import { WorkLogRecurrence } from '@work-logs/models/work-log-recurrence';
import { GetAllUserWorkLogRecurrencesQuery } from '@work-logs/queries/impl/get-all-user-work-log-recurrences.query';

@Injectable()
export class WorkLogRecurrenceService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {
    }

    async createWorkLogRecurrence(context: AuthenticatedContext, data: CreateWorkLogRecurrenceDto): Promise<WorkLogRecurrenceDto> {
        const validation = ValidationChain.validate<typeof data>()
                                          .isNotEmpty( data.minutesLogged, 'minutesLogged' )
                                          .isUUIDv4( data.projectId, 'projectId' )
                                          .isEnumList( data.weekDays, WeekDayEnum, 'weekDays' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new CreateWorkLogRecurrenceCommand( { context, payload: data } );
        const result: Result<WorkLogRecurrence> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToWorkLogRecurrenceDto( result.value! );
    }

    async updateWorkLogRecurrence(context: AuthenticatedContext, id: string, data: UpdateWorkLogRecurrenceDto): Promise<WorkLogRecurrenceDto> {
        const validation = ValidationChain.validate<typeof data & { id: string }>()
                                          .isUUIDv4( id, 'id' )
                                          .isNotEmpty( data.minutesLogged, 'minutesLogged' )
                                          .isEnumList( data.weekDays, WeekDayEnum, 'weekDays' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new UpdateWorkLogRecurrenceCommand( { context, payload: { ...data, id } } );
        const result: Result<WorkLogRecurrence> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToWorkLogRecurrenceDto( result.value! );
    }

    async activateWorkLogRecurrence(context: AuthenticatedContext, id: string): Promise<WorkLogRecurrenceDto> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( id, 'id' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new ActivateWorkLogRecurrenceCommand( { context, payload: { id } } );
        const result: Result<WorkLogRecurrence> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToWorkLogRecurrenceDto( result.value! );
    }

    async deactivateWorkLogRecurrence(context: AuthenticatedContext, id: string): Promise<WorkLogRecurrenceDto> {
        const validation = ValidationChain.validate<any>()
                                          .isUUIDv4( id, 'id' )
                                          .getResult();

        if( validation.isFailed ) {
            throw new BadRequestException( validation.errors );
        }

        const command = new DeactivateWorkLogRecurrenceCommand( { context, payload: { id } } );
        const result: Result<WorkLogRecurrence> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelToWorkLogRecurrenceDto( result.value! );
    }

    async handleRecurrentWorkLogs(context: InternalContext): Promise<WorkLog[]> {
        const command = new HandleRecurrentWorkLogsCommand( { context, payload: null } );
        const result: Result<WorkLog[]> = await this.commandBus.execute( command );

        if( result.isFailed ) {
            throw new Exception( result.errors );
        }

        return result.value!;
    }

    async getAllUserWorkLogRecurrences(context: AuthenticatedContext): Promise<WorkLogRecurrenceDto[]> {
        const query = new GetAllUserWorkLogRecurrencesQuery( { context, params: null } );
        const result: Result<WorkLogRecurrence[]> = await this.queryBus.execute( query );

        if( result.isFailed ) {
            throw new BadRequestException( result.errors );
        }

        return modelsToWorkLogRecurrenceDtoList( result.value! );
    }
}
