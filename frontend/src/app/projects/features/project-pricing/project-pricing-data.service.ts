import { Injectable } from '@angular/core';
import { ProjectDto } from '@dtos/project-dto';
import { UpdateProjectPricingDto } from '@dtos/update-project-pricing-dto';
import { ProjectActions } from '@projects/data/project.actions';
import { ProjectSelectors } from '@projects/data/project.selectors';
import { ComponentDataSource } from '@shared/data/base-component-data.service';
import { DetailsComponentDataService } from '@shared/data/details-component-data.service';

@Injectable()
export class ProjectPricingDataService extends DetailsComponentDataService<ProjectDto, {}> {
    constructor(
        private readonly projectSelectors: ProjectSelectors,
        private readonly projectActions: ProjectActions
    ) {
        super( projectSelectors );
    }

    updateProjectPricing(data: UpdateProjectPricingDto): void {
        this.entity.then( project => this.projectActions.updateProjectPricing( project.id, data ) );
    }

    protected override onInit(): void {
    }

    protected override dataSource(): ComponentDataSource<{}> {
        return {};
    }
}
