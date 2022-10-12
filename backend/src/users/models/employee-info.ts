import { CompanyPosition } from '@company/models/position/company-position';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { OptionalDate } from '@shared/models/date/optional-date';
import { Result } from '@shared/models/generics/result';
import { CreateUserEmployeeInfoDto } from '@users/dtos/create-user-employee-info.dto';
import { UpdateUserEmployeeInfoDto } from '@users/dtos/update-user-employee-info.dto';
import { EmployeeInfoEntity } from '@users/entities/employee-info.entity';
import { IEmployeeInfo } from '@users/interfaces/employee-info.interface';
import { EmployeeId } from '@users/models/employee-id';

export class EmployeeInfo implements IDomainModel<EmployeeInfo, EmployeeInfoEntity> {
    employeeId: EmployeeId;
    companyPosition: CompanyPosition;
    hiredOn: MandatoryDate;
    leftOn: OptionalDate;

    private constructor(data: IEmployeeInfo) {
        this.employeeId = data.employeeId;
        this.companyPosition = data.companyPosition;
        this.hiredOn = data.hiredOn;
        this.leftOn = data.leftOn ?? OptionalDate.empty();
    }

    static create(data: CreateUserEmployeeInfoDto, companyPosition: CompanyPosition, employeeId: EmployeeId): Result<EmployeeInfo> {
        const buildData = Result.aggregateObjects<Omit<IEmployeeInfo, 'leftOn'>>(
            { employeeId },
            { companyPosition },
            { hiredOn: MandatoryDate.create( data.hiredOn, 'hiredOn' ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new EmployeeInfo( buildData.value! ) );
    }

    static fromEntity(entity: EmployeeInfoEntity): Result<EmployeeInfo> {
        const data = Result.aggregateObjects<IEmployeeInfo>(
            { employeeId: EmployeeId.create( entity.employeeId ) },
            { companyPosition: CompanyPosition.fromEntity( entity.companyPosition ) },
            { hiredOn: MandatoryDate.create( entity.hiredOn, 'hiredOn' ) },
            { leftOn: OptionalDate.create( entity.leftOn, 'leftOn' ) }
        );

        if( data.isFailed ) {
            return Failed( ...data.errors );
        }

        return Success( new EmployeeInfo( data.value! ) );
    }

    update(data: UpdateUserEmployeeInfoDto, companyPosition?: CompanyPosition): Result<EmployeeInfo> {
        const buildData = Result.aggregateObjects<Pick<IEmployeeInfo, 'companyPosition' | 'hiredOn'>>(
            { companyPosition: companyPosition ?? this.companyPosition },
            { hiredOn: this.hiredOn.update( data.hiredOn, 'hiredOn' ) }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new EmployeeInfo( { employeeId: this.employeeId, leftOn: this.leftOn, ...buildData.value! } ) );
    }

    equals(to: EmployeeInfo): boolean {
        return this.employeeId.equals( to.employeeId );
    }

    toEntity(): EmployeeInfoEntity {
        return entityFactory( EmployeeInfoEntity, {
            employeeId     : this.employeeId.getValue(),
            companyPosition: this.companyPosition.toEntity(),
            hiredOn        : this.hiredOn.getValue(),
            leftOn         : this.leftOn.getValue()
        } );
    }
}
