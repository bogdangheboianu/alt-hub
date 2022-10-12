import { CanActivate, ExecutionContext, mixin, Type, UseGuards } from '@nestjs/common';
import { User } from '@users/models/user';
import { Observable } from 'rxjs';

const IsAdminGuard = (): Type<CanActivate> => {
    class PermissionGuardMixin implements CanActivate {
        canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
            const request = context.switchToHttp()
                                   .getRequest();
            const user: User = request.user;

            return user?.isAdmin && user.isActive();
        }
    }

    return mixin( PermissionGuardMixin );
};

export const UseAdminGuard = () => UseGuards( IsAdminGuard() );
