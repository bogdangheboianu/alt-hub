import { ConfigurationService } from '@configuration/services/configuration.service';
import { EmailSubjects, EmailTemplates } from '@email/constants/email-options.constants';
import { InviteEmailContext } from '@email/templates/context/invite-email.context';
import { VacationRequestEmailContext } from '@email/templates/context/vacation-request-email.context';
import { WorkLogRecurrenceConfirmationEmailContext } from '@email/templates/context/work-log-recurrence-confirmation-email.context';
import { EmailData, EmailOptions } from '@email/types/email-options.type';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { Success } from '@shared/functions/result-builder.functions';
import { Result } from '@shared/models/generics/result';

@Injectable()
export class EmailService {
    constructor(
        private mailerService: MailerService,
        private configService: ConfigurationService
    ) {
    }

    async sendInviteEmail(data: EmailData<InviteEmailContext>): Promise<Result<any>> {
        return this.send( {
                              ...data,
                              subject : EmailSubjects.UserInvitation,
                              template: EmailTemplates.UserInvitation
                          } );
    }

    async sendVacationRequestEmail(data: EmailData<VacationRequestEmailContext>): Promise<Result<any>> {
        return this.send( {
                              ...data,
                              subject : EmailSubjects.VacationRequest,
                              template: EmailTemplates.VacationRequest
                          } );
    }

    async sendWorkLogRecurrenceConfirmationEmail(data: EmailData<WorkLogRecurrenceConfirmationEmailContext>): Promise<Result<any>> {
        return this.send( {
                              ...data,
                              subject : EmailSubjects.WorkLogRecurrenceConfirmation,
                              template: EmailTemplates.WorkLogRecurrenceConfirmation
                          } );
    }

    @catchAsyncExceptions()
    private async send<Context extends { [name: string]: any }>(options: EmailOptions<Context>): Promise<Result<any>> {
        if( this.configService.emailServiceActive ) {
            const sentMessageInfo = await this.mailerService.sendMail( options );
            return Success( sentMessageInfo );
        }

        return Success();
    }
}
