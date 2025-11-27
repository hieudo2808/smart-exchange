import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { AppException } from "../exceptions/app.exception";
import { ExceptionCode } from "../constants/exception-code.constant";

@Injectable()
export class OwnershipGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const resourceUserId = request.params.userId || request.body.userId;

        if (user.userId !== resourceUserId) {
            throw new AppException(ExceptionCode.FORBIDDEN);
        }

        return true;
    }
}
