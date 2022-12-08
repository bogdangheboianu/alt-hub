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
import { ProjectDto } from './project-dto';
import { AuditDto } from './audit-dto';
import { UserDto } from './user-dto';
import { WeekDayEnum } from './week-day-enum';


export interface WorkLogRecurrenceDto { 
    weekDays: Array<WeekDayEnum> | null;
    id: string;
    minutesLogged: number;
    user: UserDto;
    project: ProjectDto;
    active: boolean;
    audit: AuditDto;
}

