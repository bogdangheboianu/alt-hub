import { SendInviteEmailHandler } from '@email/commands/handlers/send-invite-email.handler';
import { EMAIL_FROM } from '@email/constants/email-options.constants';
import { EmailService } from '@email/services/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { join } from 'lodash';

const CommandHandlers = [
    SendInviteEmailHandler
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
                 MailerModule.forRoot( {
                                           transport: {
                                               host  : 'smtp.example.com',
                                               secure: false,
                                               auth  : {
                                                   user: 'user@example.com',
                                                   pass: 'password'
                                               }
                                           },
                                           defaults : {
                                               from: EMAIL_FROM
                                           },
                                           template : {
                                               dir    : join( __dirname, 'templates' ),
                                               adapter: new HandlebarsAdapter(),
                                               options: {
                                                   strict: true
                                               }
                                           }
                                       } )
             ]
         } )
export class EmailModule {
}
