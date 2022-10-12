import { QueryHandler } from '@nestjs/cqrs';
import { Exception } from '@shared/exceptions/exception';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { IException } from '@shared/interfaces/generics/exception.interface';
import { BaseQueryHandler } from '@shared/models/generics/base-query-handler';
import { Result } from '@shared/models/generics/result';
import { UserNotFoundException } from '@users/exceptions/user.exceptions';
import { User } from '@users/models/user';
import { UserId } from '@users/models/user-id';
import { GetUserByIdQuery } from '@users/queries/impl/get-user-by-id.query';
import { UserRepository } from '@users/repositories/user.repository';

@QueryHandler( GetUserByIdQuery )
export class GetUserByIdHandler extends BaseQueryHandler<GetUserByIdQuery, User> {
    constructor(
        private readonly userRepository: UserRepository
    ) {
        super();
    }

    async execute(query: GetUserByIdQuery): Promise<Result<User>> {
        const user = await this.getUserById( query );

        if( user.isFailed ) {
            return this.failed( query, ...user.errors );
        }

        return this.successful( query, user.value! );
    }

    protected failed(query: GetUserByIdQuery, ...errors: IException[]): Result<any> {
        return Failed( ...errors );
    }

    protected successful(query: GetUserByIdQuery, user: User): Result<User> {
        return Success( user );
    }

    private async getUserById(query: GetUserByIdQuery): Promise<Result<User>> {
        const id = UserId.create( query.data.params.id );

        if( id.isFailed ) {
            return Failed( ...id.errors );
        }

        const user = await this.userRepository.findById( id.value! );

        if( user.isFailed ) {
            throw new Exception( user.errors );
        }

        if( user.isNotFound ) {
            return Failed( new UserNotFoundException() );
        }

        return user;
    }
}
