export class AuditDto {
    createdAt!: Date;
    createdBy!: string | null;
    updatedAt!: Date | null;
    updatedBy!: string | null;
    version!: number;
}
