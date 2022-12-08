import { CompanyPositionEntity } from '@company/entities/company-position.entity';
import { CompanyPricingProfileEntity } from '@company/entities/company-pricing-profile.entity';
import { CompanyEntity } from '@company/entities/company.entity';
import { FiscalYearEntity } from '@fiscal/entities/fiscal-year.entity';
import { FiscalYearTypeEnum } from '@fiscal/enums/fiscal-year-type.enum';
import { AuditEntity } from '@shared/entities/audit.entity';
import { CurrencyEnum } from '@shared/enums/currency.enum';
import { UserEntity } from '@users/entities/user.entity';
import { UserStatusEnum } from '@users/enums/user-status.enum';
import { Password } from '@users/models/password';
import dayjs from 'dayjs';

export const DEFAULT_AUDIT: AuditEntity = {
    createdAt: new Date(),
    updatedAt: null,
    createdBy: null,
    updatedBy: null,
    version  : 1
};

export const COMPANY: CompanyEntity = {
    id             : 'e70b7f48-b98b-4107-9f4a-25a95bf8d19f',
    name           : 'Altamira Software',
    positions      : [],
    fiscalYears    : [],
    pricingProfiles: [],
    audit          : DEFAULT_AUDIT
};

export const DEFAULT_COMPANY_POSITION: CompanyPositionEntity = {
    id   : 'f976ed1c-2c15-4719-9ed8-62aaf6a0c2df',
    name : 'Default',
    slug : 'default',
    audit: DEFAULT_AUDIT
};

export const DEFAULT_FISCAL_YEAR: FiscalYearEntity = {
    id                  : 'c40d6709-c790-467c-8410-52a8722cba89',
    type                : FiscalYearTypeEnum.CalendarYear,
    startDate           : dayjs()
        .startOf( 'year' )
        .toDate(),
    endDate             : dayjs()
        .endOf( 'year' )
        .toDate(),
    annualEmployeeSheets: [],
    audit               : DEFAULT_AUDIT
};

export const DEFAULT_PRICING_PROFILE: CompanyPricingProfileEntity = {
    id        : '302de371-6742-4721-b7a0-90ce50f3d10f',
    name      : 'Default Pricing Profile',
    hourlyRate: {
        amount  : 0,
        currency: CurrencyEnum.EUR
    },
    position  : DEFAULT_COMPANY_POSITION,
    audit     : DEFAULT_AUDIT
};

export const ADMIN_USER: UserEntity = {
    id            : '9f8d2059-c619-4302-881e-6b2b40d62eda',
    account       : {
        email      : 'admin@email.com',
        username   : 'admin',
        password   : Password.hash( 'test0000' ).value!.getValue(),
        lastLoginAt: null,
        status     : UserStatusEnum.Active,
        isAdmin    : true
    },
    personalInfo  : {
        firstName  : 'Admin',
        lastName   : 'AltHub',
        dateOfBirth: new Date(),
        ssn        : '1000000000000',
        address    : 'Admin address 1024 district Altamira',
        phone      : '0720000000'
    },
    employmentInfo: {
        employeeId     : 'ALT000',
        companyPosition: DEFAULT_COMPANY_POSITION,
        hiredOn        : new Date(),
        leftOn         : null
    },
    audit         : DEFAULT_AUDIT
};
