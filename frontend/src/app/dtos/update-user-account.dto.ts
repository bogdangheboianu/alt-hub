export class UpdateUserAccountDto {
    username!: string;
    lastLoginAt!: Date | null;
    isAdmin!: boolean;
}
