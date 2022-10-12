import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { CUSTOM_JWT_STRATEGY, PUBLIC_ROUTE_KEY } from '@security/constants/auth.constants';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard( CUSTOM_JWT_STRATEGY ) {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>( PUBLIC_ROUTE_KEY, [
            context.getHandler(),
            context.getClass()
        ] );
        
        if( isPublic ) {
            return true;
        }

        return super.canActivate( context );
    }
}
