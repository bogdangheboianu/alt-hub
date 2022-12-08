import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from '@security/entities/token.entity';
import { TokenStatusEnum } from '@security/enums/token/token-status.enum';
import { Token } from '@security/models/token/token';
import { TokenPurpose } from '@security/models/token/token-purpose';
import { TokenValue } from '@security/models/token/token-value';
import { catchAsyncExceptions } from '@shared/decorators/catch-async-exceptions.decorator';
import { Exception } from '@shared/exceptions/exception';
import { NotFound } from '@shared/functions/result-builder.functions';
import { valueIsEmpty } from '@shared/functions/value-is-empty.function';
import { Result } from '@shared/models/generics/result';
import { UserId } from '@users/models/user-id';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TokenRepository {
    constructor(@InjectRepository( TokenEntity ) private readonly repository: Repository<TokenEntity>) {
    }

    @catchAsyncExceptions()
    async findTokenByValue(value: TokenValue): Promise<Result<Token>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              value: value.getValue()
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : Token.fromEntity( result );
    }

    @catchAsyncExceptions()
    async findTokenByValueAndPurpose(value: TokenValue, purpose: TokenPurpose): Promise<Result<Token>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              value  : value.getValue(),
                                                              purpose: purpose.getValue()
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : Token.fromEntity( result );
    }

    @catchAsyncExceptions()
    async findActiveTokenByPurposeAndUserId(purpose: TokenPurpose, userId: UserId): Promise<Result<Token>> {
        const result = await this.repository.findOne( {
                                                          where: {
                                                              status : TokenStatusEnum.Active,
                                                              purpose: purpose.getValue(),
                                                              user   : {
                                                                  id: userId.getValue()
                                                              }
                                                          }
                                                      } );
        return valueIsEmpty( result )
               ? NotFound()
               : Token.fromEntity( result );
    }

    @catchAsyncExceptions()
    async saveToken(token: Token, externalTransaction?: EntityManager): Promise<Token> {
        const entity = token.toEntity();
        const savedEntity = valueIsEmpty( externalTransaction )
                            ? await this.repository.save( entity )
                            : await externalTransaction.save( entity );
        const savedToken = Token.fromEntity( savedEntity );

        if( savedToken.isFailed ) {
            throw new Exception( savedToken.errors );
        }

        return savedToken.value!;
    }
}
