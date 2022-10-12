export class UpdateWorkLogDto {
    description?: string | null;
    minutesLogged!: number;
    date!: Date;
    projectId!: string;
}
