export interface IAccessTokenPayload {
    sub: string;
    email: string;
    username: string;
    fullName: string;
    companyPosition: string | null;
}
