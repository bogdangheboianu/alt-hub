import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { Result } from '@shared/models/generics/result';
import { CreatePersonalInfoDto } from '@users/dtos/create-personal-info.dto';
import { UpdateUserPersonalInfoDto } from '@users/dtos/update-user-personal-info.dto';
import { PersonalInfoEntity } from '@users/entities/personal-info.entity';
import { IPersonalInfo } from '@users/interfaces/personal-info.interface';
import { Address } from '@users/models/address';
import { FullName } from '@users/models/full-name';
import { PhoneNumber } from '@users/models/phone-number';
import { SocialSecurityNumber } from '@users/models/social-security-number';

export class PersonalInfo implements IDomainModel<PersonalInfo, PersonalInfoEntity> {
    fullName: FullName;
    phone: PhoneNumber;
    dateOfBirth: MandatoryDate;
    ssn: SocialSecurityNumber;
    address: Address;

    private constructor(data: IPersonalInfo) {
        this.fullName = data.fullName;
        this.phone = data.phone;
        this.dateOfBirth = data.dateOfBirth;
        this.ssn = data.ssn;
        this.address = data.address;
    }

    static create(data: CreatePersonalInfoDto): Result<PersonalInfo> {
        const buildData = Result.aggregateObjects<IPersonalInfo>(
            { fullName: FullName.create( data.firstName, data.lastName ) },
            { phone: PhoneNumber.create( data.phone ) },
            { dateOfBirth: MandatoryDate.create( data.dateOfBirth, 'dateOfBirth' ) },
            { ssn: SocialSecurityNumber.create( data.ssn ) },
            { address: Address.create( data.address, 'address' ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new PersonalInfo( buildData.value! ) );
    }

    static fromEntity(entity: PersonalInfoEntity): Result<PersonalInfo> {
        const buildData = Result.aggregateObjects<IPersonalInfo>(
            { fullName: FullName.create( entity.firstName, entity.lastName ) },
            { phone: PhoneNumber.create( entity.phone ) },
            { dateOfBirth: MandatoryDate.create( entity.dateOfBirth, 'dateOfBirth' ) },
            { ssn: SocialSecurityNumber.create( entity.ssn ) },
            { address: Address.create( entity.address, 'address' ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new PersonalInfo( buildData.value! ) );
    }

    update(data: UpdateUserPersonalInfoDto): Result<PersonalInfo> {
        const buildData = Result.aggregateObjects<IPersonalInfo>(
            { fullName: this.fullName.update( data.firstName, data.lastName ) },
            { phone: this.phone.update( data.phone ) },
            { dateOfBirth: this.dateOfBirth.update( data.dateOfBirth, 'dateOfBirth' ) },
            { ssn: this.ssn.update( data.ssn ) },
            { address: this.address.update( data.address ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new PersonalInfo( buildData.value! ) );
    }

    equals(to: PersonalInfo): boolean {
        return this.ssn.equals( to.ssn );
    }

    toEntity(): PersonalInfoEntity {
        return entityFactory( PersonalInfoEntity, {
            firstName  : this.fullName.firstName,
            lastName   : this.fullName.lastName,
            phone      : this.phone.getValue(),
            dateOfBirth: this.dateOfBirth.getValue(),
            ssn        : this.ssn.getValue(),
            address    : this.address.getValue()
        } );
    }
}
