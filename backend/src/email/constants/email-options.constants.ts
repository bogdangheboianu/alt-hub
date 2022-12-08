type EmailType = 'UserInvitation' | 'VacationRequest' | 'WorkLogRecurrenceConfirmation';

export const EmailSubjects: { [key in EmailType]: string } = {
    UserInvitation               : 'Welcome to Altamira Software!',
    VacationRequest              : 'Vacation request',
    WorkLogRecurrenceConfirmation: 'Recurrent work log confirmation'
};

export const EmailTemplates: { [key in EmailType]: string } = {
    UserInvitation               : './invite-email-template',
    VacationRequest              : './vacation-request-email-template',
    WorkLogRecurrenceConfirmation: './work-log-recurrence-confirmation-email-template'
};
