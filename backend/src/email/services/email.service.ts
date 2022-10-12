import { EmailSubjects, EmailTemplates } from '@email/constants/email-options.constants';
import { UserInvitationContext } from '@email/templates/context/user-invitation.context';
import { EmailData, EmailOptions } from '@email/types/email-options.type';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) {
    }

    async sendUserInvitation(data: EmailData<UserInvitationContext>): Promise<any> {
        return this.send( {
                              ...data,
                              subject : EmailSubjects.UserInvitation,
                              template: EmailTemplates.UserInvitation
                          } );
    }

    private async send<Context>(options: EmailOptions<Context>): Promise<any> {
        // return this.mailerService.sendMail( options );
    }
}
