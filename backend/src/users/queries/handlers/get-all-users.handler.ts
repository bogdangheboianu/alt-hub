import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';
import { GetAllUsersParamsDto } from '@users/dtos/get-all-users-params.dto';
import { IUsersSelectionCriteria } from '@users/interfaces/users-selection-criteria.interface';
import { User } from '@users/models/user';
import { UserStatus } from '@users/models/user-status';
import { GetAllUsersQuery } from '@users/queries/impl/get-all-users.query';
import { UserRepository } from '@users/repositories/user.repository';

@QueryHandler( GetAllUsersQuery )
export class GetAllUsersHandler extends BaseQueryHandler<GetAllUsersQuery, User[]> {
    constructor(
        private readonly userRepository: UserRepository
    ) {
        super();
    }

    async execute(query: GetAllUsersQuery): Promise<Result<User[]>> {
        const users = await this.getAllUsers( query );

        if( users.isFailed ) {
            return this.failed( query, ...users.errors );
        }

        return this.successful( query, users.value! );
    }

    protected failed(query: GetAllUsersQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetAllUsersQuery, users: User[]): Result<User[]> {
        return Success( users );
    }

    private async getAllUsers(query: GetAllUsersQuery): Promise<Result<User[]>> {
        const { params } = query.data;
        const selectionCriteria = this.buildUsersSelectionCriteria( params );

        if( selectionCriteria.isFailed ) {
            return Failed( ...selectionCriteria.errors );
        }

        const users = await this.userRepository.findAll( selectionCriteria.value! );

        if( users.isFailed ) {
            throw new Exception( users.errors );
        }

        if( users.isNotFound ) {
            return Success( [] );
        }

        return users;
    }

    private buildUsersSelectionCriteria(params: GetAllUsersParamsDto): Result<IUsersSelectionCriteria> {
        return Result.aggregateObjects<IUsersSelectionCriteria>(
            {
                statuses: valueIsEmpty( params.statuses )
                          ? Success( undefined )
                          : Result.aggregateResults( ...params.statuses!.map( status => UserStatus.create( status ) ) )
            }
        );
    }
}
