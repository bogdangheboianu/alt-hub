import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { Result } from '@shared/models/generics/result';
import { UserEntity } from '@users/entities/user.entity';
import { UserStatusEnum } from '@users/enums/user-status.enum';
import { IUsersSelectionCriteria } from '@users/interfaces/users-selection-criteria.interface';
import { EmailAddress } from '@users/models/email-address';
import { EmployeeId } from '@users/models/employee-id';
import { PhoneNumber } from '@users/models/phone-number';
import { SocialSecurityNumber } from '@users/models/social-security-number';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { EntityManager, In, Not, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
    constructor(@InjectRepository( UserEntity ) private readonly repository: Repository<UserEntity>) {
    }

    @catchAsyncExceptions()
    async findByEmail(email: EmailAddress, excludeUserId?: UserId): Promise<Result<User>> {
        let searchConditions: any = {
            personalInfo: {
                email: email.getValue()
            }
        };

        if( valueIsNotEmpty( excludeUserId ) ) {
            searchConditions = { ...searchConditions, id: Not( excludeUserId.getValue() ) };
        }

        const result = await this.repository.findOne( { where: searchConditions } );

        return valueIsEmpty( result )
               ? NotFound()
               : User.fromEntity( result! );
    }

    @catchAsyncExceptions()
    async findByPhoneNumber(phone: PhoneNumber, excludeUserId?: UserId): Promise<Result<User>> {
        let searchConditions: any = {
            personalInfo: {
                phone: phone.getValue()
            }
        };

        if( valueIsNotEmpty( excludeUserId ) ) {
            searchConditions = { ...searchConditions, id: Not( excludeUserId.getValue() ) };
        }

        const result = await this.repository.findOne( { where: searchConditions } );

        return valueIsEmpty( result )
               ? NotFound()
               : User.fromEntity( result! );
    }

    @catchAsyncExceptions()
    async findBySocialSecurityNumber(ssn: SocialSecurityNumber, excludeUserId?: UserId): Promise<Result<User>> {
        let searchConditions: any = {
            personalInfo: {
                ssn: ssn.getValue()
            }
        };

        if( valueIsNotEmpty( excludeUserId ) ) {
            searchConditions = { ...searchConditions, id: Not( excludeUserId.getValue() ) };
        }

        const result = await this.repository.findOne( { where: searchConditions } );

        return valueIsEmpty( result )
               ? NotFound()
               : User.fromEntity( result! );
    }

    @catchAsyncExceptions()
    async findByEmployeeId(employeeId: EmployeeId): Promise<Result<User>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              employeeInfo: {
                                                                  employeeId: employeeId.getValue()
                                                              }
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : User.fromEntity( result! );
    }

    @catchAsyncExceptions()
    async findById(id: UserId): Promise<Result<User>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              id: id.getValue()
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : User.fromEntity( result! );
    }

    @catchAsyncExceptions()
    async findActiveById(id: UserId): Promise<Result<User>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              id    : id.getValue(),
                                                              status: UserStatusEnum.Active
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : User.fromEntity( result! );
    }

    @catchAsyncExceptions()
    async findActiveByEmailAddressOrUsername(emailOrUsername: string): Promise<Result<User>> {
        if( valueIsEmpty( emailOrUsername ) ) {
            return NotFound();
        }

        const result = await this.repository.findOne( {
                                                          where: [
                                                              {
                                                                  personalInfo: {
                                                                      email: emailOrUsername
                                                                  },
                                                                  status      : UserStatusEnum.Active
                                                              },
                                                              { username: emailOrUsername, status: UserStatusEnum.Active }
                                                          ]
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : User.fromEntity( result! );
    }

    @catchAsyncExceptions()
    async findAll(selectionCriteria?: IUsersSelectionCriteria): Promise<Result<User[]>> {
        let searchConditions: any = {};

        if( valueIsNotEmpty( selectionCriteria ) ) {
            const { statuses: userStatuses } = selectionCriteria;

            if( valueIsNotEmpty( userStatuses ) ) {
                const user_statuses = userStatuses.map( status => status.getValue() );
                searchConditions = { ...searchConditions, status: In( user_statuses ) };
            }
        }

        const results = await this.repository.find( {
                                                        where: searchConditions
                                                    } );
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => User.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async findAllActiveByIdList(ids: UserId[]): Promise<Result<User[]>> {
        const results = await this.repository.find( {
                                                        where: {
                                                            id    : In( ids.map( id => id.getValue() ) ),
                                                            status: UserStatusEnum.Active
                                                        }
                                                    } );
        return valueIsEmpty( results )
               ? NotFound()
               : Result.aggregateResults( ...results.map( r => User.fromEntity( r ) ) );
    }

    @catchAsyncExceptions()
    async save(user: User, externalTransaction?: EntityManager): Promise<Result<User>> {
        const entity = user.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction!.save( entity );

        return User.fromEntity( savedEntity );
    }
}
