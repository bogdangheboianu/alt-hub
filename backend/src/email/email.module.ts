import { ConfigurationModule } from '@configuration/configuration.module';
import { ConfigurationService } from '@configuration/services/configuration.service';
import { SendInviteEmailHandler } from '@email/commands/handlers/send-invite-email.handler';
import { SendVacationRequestEmailHandler } from '@email/commands/handlers/send-vacation-request-email.handler';
import { SendWorkLogRecurrenceConfirmationEmailHandler } from '@email/commands/handlers/send-work-log-recurrence-confirmation-email.handler';
import { EmailService } from '@email/services/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import * as path from 'path';

const CommandHandlers = [
    SendInviteEmailHandler,
    SendVacationRequestEmailHandler,
    SendWorkLogRecurrenceConfirmationEmailHandler
];

const Services = [
    EmailService
];

@Module( {
             providers: [
                 ...CommandHandlers,
                 ...Services
             ],
             imports  : [
                 CqrsModule,
                 ConfigurationModule,
                 MailerModule.forRootAsync( {
                                                useFactory: (configService: ConfigurationService) => (
                                                    {
                                                        transport: {
                                                            host  : configService.emailServerHost,
                                                            port  : configService.emailServerPort,
                                                            secure: configService.emailServerSecure,
                                                            auth  : {
                                                                user: configService.emailServerUser,
                                                                pass: configService.emailServerPassword
                                                            }
                                                        },
                                                        defaults : {
                                                            from: configService.defaultEmailFrom
                                                        },
                                                        template : {
                                                            dir    : path.join( process.cwd(), 'dist', 'assets', 'email-templates' ),
                                                            adapter: new HandlebarsAdapter(),
                                                            options: {
                                                                strict: true
                                                            }
                                                        },
                                                        options  : {
                                                            partials: {
                                                                dir    : path.join( process.cwd(), 'dist', 'assets', 'email-templates' ),
                                                                options: {
                                                                    strict: true
                                                                }
                                                            }
                                                        }
                                                    }
                                                ),
                                                imports   : [ ConfigurationModule ],
                                                inject    : [ ConfigurationService ]
                                            } )
             ]
         } )
export class EmailModule {
}
