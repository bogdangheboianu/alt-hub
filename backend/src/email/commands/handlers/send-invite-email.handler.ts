import { SendInviteEmailCommand } from '@email/commands/impl/send-invite-email.command';
import { FailedToSendInviteEmailEvent } from '@email/events/impl/failed-to-send-invite-email.event';
import { InviteEmailSentEvent } from '@email/events/impl/invite-email-sent.event';
import { EmailService } from '@email/services/email.service';
import { UserInvitationContext } from '@email/templates/context/user-invitation.context';
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
        private readonly emailService: EmailService
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

        return Success();
    }

    private async sendInviteEmail(command: SendInviteEmailCommand): Promise<Result<any>> {
        const { userRecipient, accountConfirmationToken } = command.data.payload;
        const token = accountConfirmationToken.value.getValue();
        const data: EmailData<UserInvitationContext> = {
            to     : userRecipient.personalInfo.email.getValue(),
            context: {
                userFirstName    : userRecipient.personalInfo.email.getValue(),
                confirmAccountUrl: `http://localhost:4200/confirm-account?token=${ token }`
            }
        };

        this.logger.log( `Sending invite email to ${ data.to } with token ${ token }` );

        await this.emailService.sendUserInvitation( data );

        return Success();
    }
}
