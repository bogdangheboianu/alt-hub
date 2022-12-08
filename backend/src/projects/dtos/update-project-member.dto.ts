export class UpdateProjectMemberDto {
    userId!: string;
    pricingProfileId!: string;
    isCoordinator!: boolean;
    allocatedHours!: number | null;
}
