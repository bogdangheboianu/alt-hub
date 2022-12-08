import { CreateAccountDto } from '@users/dtos/create-account.dto';
import { CreateEmploymentInfoDto } from '@users/dtos/create-employment-info.dto';
import { CreatePersonalInfoDto } from '@users/dtos/create-personal-info.dto';

export class CreateUserDto {
    account!: CreateAccountDto;
    personalInfo!: CreatePersonalInfoDto;
    employmentInfo!: CreateEmploymentInfoDto;
}
