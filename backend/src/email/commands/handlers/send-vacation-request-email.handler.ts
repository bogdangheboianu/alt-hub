import { ConfigurationService } from '@configuration/services/configuration.service';
import { SendVacationRequestEmailCommand } from '@email/commands/impl/send-vacation-request-email.command';
import { FailedToSendInviteEmailEvent } from '@email/events/impl/failed-to-send-invite-email.event';
import { InviteEmailSentEvent } from '@email/events/impl/invite-email-sent.event';
import { EmailService } from '@email/services/email.service';
import { VacationRequestEmailContext } from '@email/templates/context/vacation-request-email.context';
import { EmailData } from '@email/types/email-options.type';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { roFormatDate } from '@shared/functions/ro-format-date.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';
import { vacationRequestDocumentBuilder } from '@vacations/builders/vacation-request-document.builder';
import { Packer } from 'docx';

@CommandHandler( SendVacationRequestEmailCommand )
export class SendVacationRequestEmailHandler extends BaseSyncCommandHandler<SendVacationRequestEmailCommand, any> {
    private readonly logger = new Logger( SendVacationRequestEmailHandler.name );

    constructor(
        private readonly eventBus: EventBus,
        private readonly emailService: EmailService,
        private readonly configurationService: ConfigurationService
    ) {
        super();
    }

    async execute(command: SendVacationRequestEmailCommand): Promise<Result<any>> {
        const sendResult = await this.sendVacationRequestEmail( command );

        if( sendResult.isFailed ) {
            return this.failed( command, ...sendResult.errors );
        }

        return this.successful( command );
    }

    protected failed(command: SendVacationRequestEmailCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToSendInviteEmailEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: SendVacationRequestEmailCommand): Result<any> {
        const { context } = command.data;
        const event = new InviteEmailSentEvent( { context, payload: null } );

        this.eventBus.publish( event );
        this.logger.log( 'Vacation request email sent successfully!' );

        return Success();
    }

    private async sendVacationRequestEmail(command: SendVacationRequestEmailCommand): Promise<Result<any>> {
        const data = this.buildVacationRequestEmailData( command );
        const sendResult = await this.emailService.sendVacationRequestEmail( data );

        if( sendResult.isFailed ) {
            return Failed( ...sendResult.errors );
        }

        return Success();
    }

    private buildVacationRequestEmailData(command: SendVacationRequestEmailCommand): EmailData<VacationRequestEmailContext> {
        const { context: { user }, payload: { vacation } } = command.data;
        const vacationRequestDocument = Packer.toStream( vacationRequestDocumentBuilder( vacation, user ) );
        const userFullName = `${ user.personalInfo.fullName.firstName }_${ user.personalInfo.fullName.lastName }`;
        const fromDate = roFormatDate( vacation.dateInterval.from.getValue() );
        const toDate = roFormatDate( vacation.dateInterval.to.getValue() );
        const fileName = `CO_${ userFullName }_${ fromDate }${ vacation.dateInterval.isOneDay()
                                                               ? ''
                                                               : `_${ toDate }` }`;

        return {
            to         : this.configurationService.companyAdministrationEmails[0],
            context    : {
                userFullName: `${ user.personalInfo.fullName.joined }`,
                period      : `${ fromDate }${ vacation.dateInterval.isOneDay()
                                               ? ''
                                               : ` - ${ toDate }` }`
            },
            attachments: [
                {
                    filename   : `${ fileName }.docx`,
                    content    : vacationRequestDocument,
                    contentType: 'attachment'
                }
            ]
        };
    }
}
