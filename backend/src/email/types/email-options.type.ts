import { ISendMailOptions } from '@nestjs-modules/mailer';

export type EmailOptions<TemplateContext> = NonNullable<Pick<ISendMailOptions, 'to' |
                                                                               'subject' |
                                                                               'template'>> & { context: TemplateContext };

export type EmailData<TemplateContext> = Pick<EmailOptions<TemplateContext>, 'to' | 'context'>;
