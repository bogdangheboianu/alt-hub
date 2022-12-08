export class CreateProjectMemberDto {
    userId!: string;
    pricingProfileId!: string;
    isCoordinator!: boolean;
    allocatedHours?: number | null;
}
