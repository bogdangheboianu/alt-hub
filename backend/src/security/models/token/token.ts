import { GenerateTokenCommand } from '@security/commands/impl/token/generate-token.command';
import { AUTH_ACCESS_TOKEN_VALIDITY_MIN } from '@security/constants/token.constants';
import { TokenEntity } from '@security/entities/token.entity';
import { TokenStatusEnum } from '@security/enums/token/token-status.enum';
import { InvalidNonActiveTokenStatusException } from '@security/exceptions/token.exceptions';
import { IToken } from '@security/interfaces/token.interface';
import { TokenId } from '@security/models/token/token-id';
import { TokenPurpose } from '@security/models/token/token-purpose';
import { TokenStatus } from '@security/models/token/token-status';
import { TokenValue } from '@security/models/token/token-value';
import { entityFactory } from '@shared/functions/entity-factory.function';
import { Failed, Success } from '@shared/functions/result-builder.functions';
import { valueIsNotEmpty } from '@shared/functions/value-is-not-empty.function';
import { IDomainModel } from '@shared/interfaces/generics/domain-model.interface';
import { MandatoryDate } from '@shared/models/date/mandatory-date';
import { Result } from '@shared/models/generics/result';
import { OptionalPositiveNumber } from '@shared/models/numerical/optional-positive-number';
import { User } from '@users/models/user';

export class Token implements IDomainModel<Token, TokenEntity> {
    id: TokenId;
    value: TokenValue;
    generatedAt: MandatoryDate;
    validForMinutes: OptionalPositiveNumber;
    status: TokenStatus;
    purpose: TokenPurpose;
    user: User | null;

    private constructor(data: IToken) {
        this.id = data.id ?? TokenId.generate();
        this.value = data.value;
        this.generatedAt = data.generatedAt ?? MandatoryDate.now();
        this.validForMinutes = data.validForMinutes ?? OptionalPositiveNumber.empty();
        this.status = data.status ?? TokenStatus.active();
        this.purpose = data.purpose;
        this.user = data.user ?? null;
    }

    static create(command: GenerateTokenCommand): Result<Token> {
        const { payload } = command.data;
        const buildData = Result.aggregateObjects<Pick<IToken, 'value' | 'validForMinutes' | 'purpose' | 'user'>>(
            { value: TokenValue.create( payload.value ) },
            { validForMinutes: OptionalPositiveNumber.create( payload.validForMinutes, 'validForMinutes' ) },
            { purpose: TokenPurpose.create( payload.purpose ) },
            { user: payload.user ?? undefined }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new Token( buildData.value! ) );
    }

    static createForAuth(value: string, user: User): Result<Token> {
        const tokenValue = TokenValue.create( value );

        if( tokenValue.isFailed ) {
            return Failed( ...tokenValue.errors );
        }

        return Success(
            new Token( {
                           value          : tokenValue.value!,
                           validForMinutes: OptionalPositiveNumber.ofUnchecked( AUTH_ACCESS_TOKEN_VALIDITY_MIN ),
                           purpose        : TokenPurpose.forAuthentication(),
                           user
                       } )
        );
    }

    static fromEntity(entity: TokenEntity): Result<Token> {
        const buildData = Result.aggregateObjects<IToken>(
            { id: TokenId.create( entity.id ) },
            { value: TokenValue.create( entity.value ) },
            { generatedAt: MandatoryDate.create( entity.generatedAt, 'generatedAt' ) },
            { validForMinutes: OptionalPositiveNumber.create( entity.validForMinutes, 'validForMinutes' ) },
            { status: TokenStatus.create( entity.status ) },
            { purpose: TokenPurpose.create( entity.purpose ) },
            {
                user: valueIsNotEmpty( entity.user )
                      ? User.fromEntity( entity.user )
                      : undefined
            }
        );

        if( buildData.isFailed ) {
            return Failed( ...buildData.errors );
        }

        return Success( new Token( buildData.value! ) );
    }

    equals(to: Token): boolean {
        return this.id.equals( to.id );
    }

    toEntity(): TokenEntity {
        return entityFactory( TokenEntity, {
            id             : this.id.getValue(),
            value          : this.value.getValue(),
            generatedAt    : this.generatedAt.getValue(),
            validForMinutes: this.validForMinutes.getValue(),
            status         : this.status.getValue(),
            purpose        : this.purpose.getValue(),
            user           : this.user?.toEntity() ?? null
        } );
    }

    isNotActive(): boolean {
        return !(
            this.status.hasValueActive() &&
            this.generatedAt
                .add( this.validForMinutes.getValue(), 'minutes' )
                .isFutureDate()
        );
    }

    isActive(): boolean {
        return !this.isNotActive();
    }

    invalidate(nonActiveStatus: TokenStatusEnum): Result<Token> {
        const newStatusResult = TokenStatus.create( nonActiveStatus );

        if( newStatusResult.isFailed ) {
            return Failed( ...newStatusResult.errors );
        }

        const newStatus = newStatusResult.value!;

        if( !newStatus.isNonActive() ) {
            return Failed( new InvalidNonActiveTokenStatusException() );
        }

        return Success(
            new Token( {
                           ...this,
                           status: newStatus
                       } )
        );
    }
}
