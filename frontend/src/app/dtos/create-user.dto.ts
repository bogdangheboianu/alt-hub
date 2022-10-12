import { CreateEmployeeInfoDto } from '@dtos/create-employee-info.dto';
import { CreatePersonalInfoDto } from '@dtos/create-personal-info.dto';

export class CreateUserDto {
    personalInfo!: CreatePersonalInfoDto;
    employeeInfo!: CreateEmployeeInfoDto;
    isAdmin!: boolean;
    password!: string;
}
