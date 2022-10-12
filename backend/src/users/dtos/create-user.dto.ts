import { CreateUserEmployeeInfoDto } from '@users/dtos/create-user-employee-info.dto';
import { CreateUserPersonalInfoDto } from '@users/dtos/create-user-personal-info.dto';

export class CreateUserDto {
    personalInfo!: CreateUserPersonalInfoDto;
    employeeInfo!: CreateUserEmployeeInfoDto;
    isAdmin!: boolean;
    password!: string;
}
