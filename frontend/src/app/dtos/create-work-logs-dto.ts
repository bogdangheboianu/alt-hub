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
import { WeekDayEnum } from './week-day-enum';


export interface CreateWorkLogsDto { 
    weekDaysRecurrence?: Array<WeekDayEnum> | null;
    description?: string | null;
    minutesLogged: number;
    dates: Array<string>;
    projectId: string;
}

