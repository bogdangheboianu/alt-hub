export const EMAIL_FROM = 'Altamira@Hub';

type EmailType = 'UserInvitation'

export const EmailSubjects: { [key in EmailType]: string } = {
    UserInvitation: 'Welcome to Altamira Software!'
};

export const EmailTemplates: { [key in EmailType]: string } = {
    UserInvitation: './user-invitation'
};
