import { CompanyPosition } from '@company/models/company-position';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { OptionalDate } from '@shared/models/date/optional-date';
import { Result } from '@shared/models/generics/result';
import { CreateEmploymentInfoDto } from '@users/dtos/create-employment-info.dto';
import { UpdateUserEmploymentInfoDto } from '@users/dtos/update-user-employment-info.dto';
import { EmploymentInfoEntity } from '@users/entities/employment-info.entity';
import { IEmploymentInfo } from '@users/interfaces/employment-info.interface';
import { EmployeeId } from '@users/models/employee-id';

export class EmploymentInfo implements IDomainModel<EmploymentInfo, EmploymentInfoEntity> {
    employeeId: EmployeeId;
    companyPosition: CompanyPosition;
    hiredOn: MandatoryDate;
    leftOn: OptionalDate;

    private constructor(data: IEmploymentInfo) {
        this.employeeId = data.employeeId;
        this.companyPosition = data.companyPosition;
        this.hiredOn = data.hiredOn;
        this.leftOn = data.leftOn ?? OptionalDate.empty();
    }

    static create(data: CreateEmploymentInfoDto, companyPosition: CompanyPosition, employeeId: EmployeeId): Result<EmploymentInfo> {
        const buildData = Result.aggregateObjects<Omit<IEmploymentInfo, 'leftOn'>>(
            { employeeId },
            { companyPosition },
            { hiredOn: MandatoryDate.create( data.hiredOn, 'hiredOn' ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new EmploymentInfo( buildData.value! ) );
    }

    static fromEntity(entity: EmploymentInfoEntity): Result<EmploymentInfo> {
        const data = Result.aggregateObjects<IEmploymentInfo>(
            { employeeId: EmployeeId.create( entity.employeeId ) },
            { companyPosition: CompanyPosition.fromEntity( entity.companyPosition ) },
            { hiredOn: MandatoryDate.create( entity.hiredOn, 'hiredOn' ) },
            { leftOn: OptionalDate.create( entity.leftOn, 'leftOn' ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new EmploymentInfo( data.value! ) );
    }

    update(data: UpdateUserEmploymentInfoDto, companyPosition?: CompanyPosition): Result<EmploymentInfo> {
        const buildData = Result.aggregateObjects<Pick<IEmploymentInfo, 'companyPosition' | 'hiredOn'>>(
            { companyPosition: companyPosition ?? this.companyPosition },
            { hiredOn: this.hiredOn.update( data.hiredOn, 'hiredOn' ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new EmploymentInfo( { employeeId: this.employeeId, leftOn: this.leftOn, ...buildData.value! } ) );
    }

    equals(to: EmploymentInfo): boolean {
        return this.employeeId.equals( to.employeeId );
    }

    toEntity(): EmploymentInfoEntity {
        return entityFactory( EmploymentInfoEntity, {
            employeeId     : this.employeeId.getValue(),
            companyPosition: this.companyPosition.toEntity(),
            hiredOn        : this.hiredOn.getValue(),
            leftOn         : this.leftOn.getValue()
        } );
    }
}
