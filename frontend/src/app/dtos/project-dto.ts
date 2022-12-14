/**
 * Altamira Hub
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { AuditDto } from './audit-dto';
import { ProjectPricingDto } from './project-pricing-dto';
import { ProjectMemberDto } from './project-member-dto';
import { ProjectTimelineDto } from './project-timeline-dto';
import { ProjectInfoDto } from './project-info-dto';


export interface ProjectDto { 
    id: string;
    info: ProjectInfoDto;
    timeline: ProjectTimelineDto;
    pricing: ProjectPricingDto | null;
    members: Array<ProjectMemberDto>;
    audit: AuditDto;
}

