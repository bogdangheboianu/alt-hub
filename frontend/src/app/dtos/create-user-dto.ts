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
import { CreatePersonalInfoDto } from './create-personal-info-dto';
import { CreateEmploymentInfoDto } from './create-employment-info-dto';
import { CreateAccountDto } from './create-account-dto';


export interface CreateUserDto { 
    account: CreateAccountDto;
    personalInfo: CreatePersonalInfoDto;
    employmentInfo: CreateEmploymentInfoDto;
}

