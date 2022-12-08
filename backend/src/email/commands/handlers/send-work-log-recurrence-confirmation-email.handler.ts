import { ConfigurationService } from '@configuration/services/configuration.service';
import { SendWorkLogRecurrenceConfirmationEmailCommand } from '@email/commands/impl/send-work-log-recurrence-confirmation-email.command';
import { FailedToSendWorkLogRecurrenceConfirmationEmailEvent } from '@email/events/impl/failed-to-send-work-log-recurrence-confirmation-email.event';
import { WorkLogRecurrenceConfirmationSentEvent } from '@email/events/impl/work-log-recurrence-confirmation-email-sent.event';
import { EmailService } from '@email/services/email.service';
import { WorkLogRecurrenceConfirmationEmailContext } from '@email/templates/context/work-log-recurrence-confirmation-email.context';
import { EmailData } from '@email/types/email-options.type';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( SendWorkLogRecurrenceConfirmationEmailCommand )
export class SendWorkLogRecurrenceConfirmationEmailHandler extends BaseSyncCommandHandler<SendWorkLogRecurrenceConfirmationEmailCommand, any> {
    private readonly logger = new Logger( SendWorkLogRecurrenceConfirmationEmailHandler.name );

    constructor(
        private readonly eventBus: EventBus,
        private readonly emailService: EmailService,
        private readonly configurationService: ConfigurationService
    ) {
        super();
    }

    async execute(command: SendWorkLogRecurrenceConfirmationEmailCommand): Promise<Result<any>> {
        const sendResult = await this.sendWorkLogRecurrenceConfirmationEmail( command );

        if( sendResult.isFailed ) {
            return this.failed( command, ...sendResult.errors );
        }

        return this.successful( command );
    }

    protected failed(command: SendWorkLogRecurrenceConfirmationEmailCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToSendWorkLogRecurrenceConfirmationEmailEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: SendWorkLogRecurrenceConfirmationEmailCommand): Result<any> {
        const { context } = command.data;
        const event = new WorkLogRecurrenceConfirmationSentEvent( { context, payload: null } );

        this.eventBus.publish( event );
        this.logger.log( 'Work log recurrence confirmation email sent successfully!' );

        return Success();
    }

    private async sendWorkLogRecurrenceConfirmationEmail(command: SendWorkLogRecurrenceConfirmationEmailCommand): Promise<Result<any>> {
        const data = this.buildWorkLogRecurrenceConfirmationEmailData( command );
        const sendResult = await this.emailService.sendWorkLogRecurrenceConfirmationEmail( data );

        if( sendResult.isFailed ) {
            return Failed( ...sendResult.errors );
        }

        return Success();
    }

    private buildWorkLogRecurrenceConfirmationEmailData(command: SendWorkLogRecurrenceConfirmationEmailCommand): EmailData<WorkLogRecurrenceConfirmationEmailContext> {
        const { payload: { workLogRecurrence: { user, minutesLogged, project } } } = command.data;

        return {
            to     : user.account.email.getValue(),
            context: {
                userFirstName: user.personalInfo.fullName.firstName,
                timeLogged   : `${ (
                    minutesLogged.divideBy( 60 ).value!.getValue()
                                                       .toFixed( 1 )
                ) }h`,
                projectName  : project.info.name.getValue(),
                userPageUrl  : `${ this.configurationService.frontendBaseUrl }/employees/${ user.id.getValue() }`
            }
        };
    }
}
