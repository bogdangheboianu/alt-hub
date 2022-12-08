import { ConfigurationService } from '@configuration/services/configuration.service';
import { SendInviteEmailCommand } from '@email/commands/impl/send-invite-email.command';
import { FailedToSendInviteEmailEvent } from '@email/events/impl/failed-to-send-invite-email.event';
import { InviteEmailSentEvent } from '@email/events/impl/invite-email-sent.event';
import { EmailService } from '@email/services/email.service';
import { InviteEmailContext } from '@email/templates/context/invite-email.context';
import { EmailData } from '@email/types/email-options.type';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseSyncCommandHandler } from '@shared/models/generics/base-command-handler';
import { Result } from '@shared/models/generics/result';

@CommandHandler( SendInviteEmailCommand )
export class SendInviteEmailHandler extends BaseSyncCommandHandler<SendInviteEmailCommand, any> {
    private readonly logger = new Logger( SendInviteEmailHandler.name );

    constructor(
        private readonly eventBus: EventBus,
        private readonly emailService: EmailService,
        private readonly configurationService: ConfigurationService
    ) {
        super();
    }

    async execute(command: SendInviteEmailCommand): Promise<Result<any>> {
        const sendResult = await this.sendInviteEmail( command );

        if( sendResult.isFailed ) {
            return this.failed( command, ...sendResult.errors );
        }

        return this.successful( command );
    }

    protected failed(command: SendInviteEmailCommand, ...errors: IException[]): Result<any> {
        const { context } = command.data;
        const event = new FailedToSendInviteEmailEvent( { context, errors } );

        this.eventBus.publish( event );

        return Failed( ...errors );
    }

    protected successful(command: SendInviteEmailCommand): Result<any> {
        const { context } = command.data;
        const event = new InviteEmailSentEvent( { context, payload: null } );

        this.eventBus.publish( event );
        this.logger.log( 'Invite email sent successfully!' );

        return Success();
    }

    private async sendInviteEmail(command: SendInviteEmailCommand): Promise<Result<any>> {
        const data = this.buildInviteEmailData( command );
        const sendResult = await this.emailService.sendInviteEmail( data );

        if( sendResult.isFailed ) {
            return Failed( ...sendResult.errors );
        }

        return Success();
    }

    private buildInviteEmailData(command: SendInviteEmailCommand): EmailData<InviteEmailContext> {
        const { userRecipient, accountActivationToken } = command.data.payload;
        const token = accountActivationToken.value.getValue();
        return {
            to     : userRecipient.account.email.getValue(),
            context: {
                userFirstName     : userRecipient.personalInfo.fullName.firstName,
                activateAccountUrl: `${ this.configurationService.frontendBaseUrl }/activate-account?token=${ token }`
            }
        };
    }
}
