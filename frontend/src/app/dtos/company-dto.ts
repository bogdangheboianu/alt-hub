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
import { CompanyPricingProfileDto } from './company-pricing-profile-dto';
import { AuditDto } from './audit-dto';
import { FiscalYearDto } from './fiscal-year-dto';
import { CompanyPositionDto } from './company-position-dto';


export interface CompanyDto { 
    id: string;
    name: string;
    positions: Array<CompanyPositionDto>;
    fiscalYears: Array<FiscalYearDto>;
    pricingProfiles: Array<CompanyPricingProfileDto>;
    audit: AuditDto;
}
